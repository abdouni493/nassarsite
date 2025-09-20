import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Calculator,
  Receipt,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE } from "@/config";

export default function Invoicing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesRes = await fetch(`${API_BASE}/invoices`);
        const customersRes = await fetch(`${API_BASE}/customers`);
        const suppliersRes = await fetch(`${API_BASE}/suppliers`);

        setInvoices(await invoicesRes.json());
        setCustomers(await customersRes.json());
        setSuppliers(await suppliersRes.json());
      } catch (err) {
        console.error("Erreur chargement données facturation:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Filtering
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.id
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || invoice.type === filterType;
    const matchesStatus =
      filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // ✅ Helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        label: "Payée",
        variant: "default" as const,
        className: "bg-success text-success-foreground",
      },
      pending: {
        label: "En attente",
        variant: "secondary" as const,
        className: "bg-warning text-warning-foreground",
      },
      cancelled: {
        label: "Annulée",
        variant: "destructive" as const,
        className: "",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === "sale" ? (
      <Badge variant="outline" className="border-success text-success">
        <ShoppingCart className="w-3 h-3 mr-1" />
        Vente
      </Badge>
    ) : (
      <Badge variant="outline" className="border-primary text-primary">
        <Truck className="w-3 h-3 mr-1" />
        Achat
      </Badge>
    );
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Client inconnu";
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier?.name || "Fournisseur inconnu";
  };

  // ✅ Totals
  const totalSales = invoices
    .filter((inv) => inv.type === "sale")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPurchases = invoices
    .filter((inv) => inv.type === "purchase")
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingInvoices = invoices.filter(
    (inv) => inv.status === "pending"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Facturation</h1>
          <p className="text-muted-foreground">
            Gérez vos factures d&apos;achat et de vente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stat-card gradient-success text-success-foreground [&_.text-2xl]:text-white [&_.text-sm]:text-white/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventes</CardTitle>
            <Receipt className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs">Ce mois</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Achats
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPurchases)}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Factures
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card className="stat-card gradient-warning text-warning-foreground [&_.text-2xl]:text-white [&_.text-sm]:text-white/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Calculator className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs">Factures</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par numéro de facture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 search-input"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="sale">Ventes</SelectItem>
                <SelectItem value="purchase">Achats</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client/Fournisseur</TableHead>
                <TableHead>Montant HT</TableHead>
                <TableHead>Montant TTC</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">
                    {invoice.id}
                  </TableCell>
                  <TableCell>{getTypeBadge(invoice.type)}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>
                    {invoice.type === "sale"
                      ? getCustomerName(invoice.customerId || "")
                      : getSupplierName(invoice.supplierId || "")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.subtotal)}
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucune facture trouvée
              </h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou créez votre
                première facture.
              </p>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Créer une Facture
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
