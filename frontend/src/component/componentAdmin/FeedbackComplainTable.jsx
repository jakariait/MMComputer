import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from 'lucide-react';
import useAuthAdminStore from '../../store/AuthAdminStore.js';
import { SectionHeader } from '#component/componentAdmin/SectionHeader.jsx';
import dayjs from 'dayjs';

const columns = [
  { id: 'serialNumber', label: 'S.No.' },
  { id: 'fullName', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'emailAddress', label: 'Email Address' },
  { id: 'subject', label: 'Subject', className: 'max-w-[200px]' },
  { id: 'details', label: 'Details', className: 'max-w-[270px]' },
  { id: 'date', label: 'Date' },
  { id: 'actions', label: 'Actions' },
];

const FeedbackComplainTable = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/complain-feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(
          (data.data || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [apiUrl, token]);

  const handleDelete = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/complain-feedback/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');
      setItems((prev) => prev.filter((item) => item._id !== deleteId));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const pageCount = Math.ceil(items.length / rowsPerPage);
  const paginated = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title={'Feedback & Complaints'}
        description={`${items.length} total submissions`}
      />

      <Card className="shadow-md border-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.id}>{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground py-8"
                      >
                        No submissions available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="text-muted-foreground">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.fullName}
                        </TableCell>
                        <TableCell>{item.phoneNumber}</TableCell>
                        <TableCell>{item.emailAddress}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.subject}
                        </TableCell>
                        <TableCell className="max-w-[270px] truncate">
                          {item.details}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {dayjs(item.createdAt).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => {
                                setViewItem(item);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => {
                                setDeleteId(item._id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {items.length > rowsPerPage && (
                <div className="flex items-center justify-between border-t border-muted-foreground/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Rows per page:
                    </p>
                    <Select
                      value={String(rowsPerPage)}
                      onValueChange={(value) => {
                        setRowsPerPage(Number(value));
                        setPage(0);
                      }}
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 30, 50, 100].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Page {page + 1} of {pageCount}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page >= pageCount - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this submission? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Full Name:
                </span>
                <span className="col-span-2">{viewItem.fullName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Phone:
                </span>
                <span className="col-span-2">{viewItem.phoneNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <span className="col-span-2">
                  {viewItem.emailAddress || '—'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Subject:
                </span>
                <span className="col-span-2">{viewItem.subject}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Details:
                </span>
                <span className="col-span-2 whitespace-pre-wrap">
                  {viewItem.details}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  Submitted:
                </span>
                <span className="col-span-2">
                  {dayjs(viewItem.createdAt).format('DD/MM/YYYY hh:mm A')}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackComplainTable;
