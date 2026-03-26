"use client"

import { useState } from "react"
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
import { MoreHorizontalIcon } from "lucide-react"
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
            await updateProduct({
                id: selectedProduct.id,
                title: formData.title,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
            }).unwrap()

            setIsDialogOpen(false)
            alert("✅ Product updated successfully!")
        } catch (err: unknown) {
            const message =
                (err as any)?.data?.message ||
                (err as any)?.message ||
                "Unknown error"

            alert(`❌ Update failed: ${message}`)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            setDeletingId(id)

            await deleteProduct(id).unwrap()

            alert("✅ Product deleted successfully!")
        } catch (err: unknown) {
            const message =
                (err as any)?.data?.message ||
                (err as any)?.message ||
                "Unknown error"

            alert(`❌ Delete failed: ${message}`)
        } finally {
            setDeletingId(null)
        }
    }

    if (isLoading) return <p className="text-center py-8">Loading products...</p>

    if (isError)
        return (
            <p className="text-center py-8 text-red-500">
                {(error as any)?.data?.message ?? "Something went wrong"}
            </p>
        )

    if (products.length === 0)
        return <p className="text-center py-8">No products found</p>

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <MoreHorizontalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenUpdate(product)}>
                                            Update
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
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

                    <div className="flex flex-col gap-4 py-4">
                        <Input
                            placeholder="Product title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({ ...formData, price: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Category ID"
                            type="number"
                            value={formData.categoryId}
                            onChange={(e) =>
                                setFormData({ ...formData, categoryId: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}