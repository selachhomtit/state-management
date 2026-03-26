"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {toast} from "sonner";
import {useCreateProductMutation} from "@/lib/features/products/product-api";


const formSchema = z.object({
    title: z
        .string()
        .min(2, "Bug title must be at least 5 characters."),
    description: z
        .string()
        .min(2, "Description must be at least 20 characters.")

})

export function ProductForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })


    const [addProduct, {data, isLoading, isSuccess, error}] = useCreateProductMutation()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const mockProduct = {
            title: "PC 123456",
            price: 1000,
            categoryId: 3,
            description:"PC insert RTK with route handler",
            images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXPbFxEPRjdslgEmGXhWaMXfcHN3jEwEfGmA&s"
            ]
        }

        try{
            const payload = await addProduct(mockProduct).unwrap()
            console.log("payload insert", payload)
            console.log("err")
            if(isSuccess){
                toast.success("Success")
            }
        }catch (err) {
            console.log("err", err)
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Bug Report</CardTitle>
                <CardDescription>
                    {
                        isSuccess ? `Product ${data.title} inserted!` : "Product Form"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Bug Title
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Login button not working on mobile"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description">
                                        Description
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="I'm having an issue with the login button on mobile."
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/100 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>
                                        Include steps to reproduce, expected behavior, and what
                                        actually happened.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button
                        disabled={isLoading}
                        type="submit" form="form-rhf-demo"
                    >
                        {
                            isLoading ? "Submitting..." : "Submit"
                        }

                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
