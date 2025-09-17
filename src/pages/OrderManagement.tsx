import { useState } from 'react';
import { Eye, Trash2, MoreHorizontal, DollarSign, User, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/contexts/LanguageContext';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';
import { toast } from '@/hooks/use-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { t } = useTranslation();

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    toast({
      title: "Commande supprimée",
      description: "La commande a été supprimée avec succès.",
    });
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);
    toast({
      title: "Statut mis à jour",
      description: `Le statut de la commande a été changé en ${getStatusLabel(newStatus)}.`,
    });
  };

  const handleApplyDiscount = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, discount: discountAmount, total: order.total - discountAmount }
        : order
    );
    setOrders(updatedOrders);
    setShowDiscountDialog(false);
    setDiscountAmount(0);
    setSelectedOrder(null);
    toast({
      title: "Remise appliquée",
      description: `Une remise de ${discountAmount} DZD a été appliquée à la commande.`,
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const openDiscountDialog = (order: Order) => {
    setSelectedOrder(order);
    setDiscountAmount(order.discount || 0);
    setShowDiscountDialog(true);
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return t('pending');
      case 'confirmed':
        return t('confirmed');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    return { pending, confirmed, completed, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">{t('orderManagement')}</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="management-card p-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-warning/10 rounded-full">
              <Calendar size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-muted-foreground">En attente</p>
            </div>
          </div>
        </Card>

        <Card className="management-card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
              <p className="text-muted-foreground">Confirmées</p>
            </div>
          </div>
        </Card>

        <Card className="management-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-full">
              <Phone size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              <p className="text-muted-foreground">Terminées</p>
            </div>
          </div>
        </Card>

        <Card className="management-card p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-full">
              <DollarSign size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-muted-foreground">Revenus (DZD)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="management-card animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Liste des Commandes
          </h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t('clientName')}</TableHead>
                  <TableHead>{t('phoneNumber')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('total')}</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(-6)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.clientName}
                    </TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status) as any}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.total.toLocaleString()} DZD
                      {order.discount && order.discount > 0 && (
                        <div className="text-xs text-success">
                          (-{order.discount} DZD remise)
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye size={16} />
                        </Button>
                        
                        <Select onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder={<MoreHorizontal size={16} />} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmé</SelectItem>
                            <SelectItem value="completed">Terminé</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDiscountDialog(order)}
                        >
                          <DollarSign size={16} />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-danger hover:text-danger-foreground hover:bg-danger"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la commande #{selectedOrder?.id.slice(-6)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <p className="font-medium">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <Label>Articles commandés</Label>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()} DZD x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {item.total.toLocaleString()} DZD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{selectedOrder.total.toLocaleString()} DZD</span>
                </div>
                {selectedOrder.discount && selectedOrder.discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-success">
                    <span>Remise appliquée</span>
                    <span>-{selectedOrder.discount.toLocaleString()} DZD</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appliquer une remise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discount">Montant de la remise (DZD)</Label>
              <Input
                id="discount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            {selectedOrder && (
              <div className="text-sm text-muted-foreground">
                <p>Total original: {selectedOrder.total.toLocaleString()} DZD</p>
                <p>Nouveau total: {(selectedOrder.total - discountAmount).toLocaleString()} DZD</p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDiscountDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleApplyDiscount}>
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;