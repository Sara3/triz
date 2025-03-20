import React, { useState } from 'react';
import { FileText, Info, Check, Plus, Trash, Edit, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PatentUploader from '@/components/ui-custom/PatentUploader';
import { MOCK_PATENTS, TRIZ_PRINCIPLES } from '@/lib/mock-data';
import { 
  getAllParameters,
  COMMON_CONTRADICTIONS,
  getSuggestedPrinciples,
  getAllPrincipleNames,
  getPrincipleDetailsByName,
  addCustomParameter
} from '@/lib/triz-utils';
import { TrizContradiction } from '@/lib/types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrincipleSelector from '@/components/ui-custom/PrincipleSelector';
import { useNavigate } from 'react-router-dom';
import { PatentForm } from '@/components/PatentForm';
import { Patent } from '@/lib/api';

const PatentUpload: React.FC = () => {
  const navigate = useNavigate();
  const [successfulUpload, setSuccessfulUpload] = useState(false);

  const handleSuccess = (patent: Patent) => {
    setSuccessfulUpload(true);
    toast.success(`Patent ${patent.patent_number} successfully created!`);
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload New Patent</h1>
        <p className="text-muted-foreground">
          Add a new patent to the database by filling out the form below
        </p>
      </div>

      {successfulUpload ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <h2 className="text-2xl font-semibold">Patent Successfully Uploaded!</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Your patent has been added to the database. You can now view it in the patents list or upload another one.
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => navigate('/admin')}>
              View All Patents
            </Button>
            <Button variant="outline" onClick={() => setSuccessfulUpload(false)}>
              Upload Another Patent
            </Button>
          </div>
        </div>
      ) : (
        <PatentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default PatentUpload;
