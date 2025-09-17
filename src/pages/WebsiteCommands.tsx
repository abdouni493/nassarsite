import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/LanguageContext";
import { Trash2, Eye, RefreshCcw } from "lucide-react";
import axios from "axios";

interface Command {
  id: number;
  customer_name: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

const WebsiteCommands = () => {
  const { t } = useTranslation();
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch commands from backend
  const fetchCommands = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Command[]>("http://localhost:5000/api/commands");
      setCommands(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch commands:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  // Update command status
  const handleChangeStatus = async (id: number) => {
    const newStatus = prompt("Enter new status (e.g., Pending, Completed, Shipped):");
    if (!newStatus) return;
    try {
      await axios.patch(`http://localhost:5000/api/commands/${id}`, { status: newStatus });
      setCommands(prev =>
        prev.map(cmd => (cmd.id === id ? { ...cmd, status: newStatus } : cmd))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Delete a command
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this command?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/commands/${id}`);
      setCommands(prev => prev.filter(cmd => cmd.id !== id));
    } catch (err) {
      console.error("Failed to delete command:", err);
    }
  };

  // View details (just alert for now)
  const handleViewDetails = (cmd: Command) => {
    alert(
      `Customer: ${cmd.customer_name}\nProduct: ${cmd.product_name}\nQuantity: ${cmd.quantity}\nTotal: $${cmd.total_price}\nStatus: ${cmd.status}`
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card p-6 shadow-lg rounded-2xl animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-4">{t("commandsManagement")}</h1>

        {loading ? (
          <p>Loading...</p>
        ) : commands.length === 0 ? (
          <p>No commands found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted text-muted-foreground">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commands.map(cmd => (
                  <tr key={cmd.id} className="border-b border-border">
                    <td className="px-4 py-2">{cmd.id}</td>
                    <td className="px-4 py-2">{cmd.customer_name}</td>
                    <td className="px-4 py-2">{cmd.product_name}</td>
                    <td className="px-4 py-2">{cmd.quantity}</td>
                    <td className="px-4 py-2">${cmd.total_price.toFixed(2)}</td>
                    <td className="px-4 py-2">{cmd.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleChangeStatus(cmd.id)}
                      >
                        <RefreshCcw size={16} className="mr-1" /> Change Status
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(cmd)}
                      >
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cmd.id)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WebsiteCommands;
