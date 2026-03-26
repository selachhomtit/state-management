"use client"

import { useState } from "react"
import { toast } from "sonner" // Import sonner for notifications
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MoreHorizontalIcon, Loader2 } from "lucide-react"
import { ProductResponse } from "@/lib/types/product-type"
import {
    useGetProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "@/lib/features/products/product-api"

export function ProductListClient() {
    const { data: products = [], isLoading, isError, error } = useGetProductsQuery()
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        categoryId: "",
    })

    const handleOpenUpdate = (product: ProductResponse) => {
        setSelectedProduct(product)
        setFormData({
            title: product.title,
            price: String(product.price),
            categoryId: String(product.category?.id ?? ""),
        })
        setIsDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedProduct) return

        try {
            // Only send fields that changed to keep it a partial update
            await updateProduct({
                id: selectedProduct.id,
                title: formData.title,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
            }).unwrap()

            setIsDialogOpen(false)
            toast.success("Product updated successfully")
        } catch (err: any) {
            const errorMessage = err?.data?.message || "Failed to update product"
            toast.error(errorMessage)
        }
    }

    const handleDelete = async (id: number) => {
        // You can replace window.confirm with a Shadcn AlertDialog later
        if (!confirm("Are you sure?")) return

        try {
            setDeletingId(id)
            await deleteProduct(id).unwrap()
            toast.success("Product deleted successfully")
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete product")
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>

    if (isError) return <p className="text-center py-8 text-red-500">Error loading products.</p>

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.title}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.category?.name}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenUpdate(product)}>
                                            Update
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                        >
                                            {deletingId === product.id ? "Deleting..." : "Delete"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Product</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Price</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Category ID</label>
                            <Input
                                type="number"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}