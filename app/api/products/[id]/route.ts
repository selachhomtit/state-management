import { NextRequest, NextResponse } from "next/server"

const baseApi = process.env.NEXT_PUBLIC_API

type Params = { params: Promise<{ id: string }> }

// GET /api/products/:id
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const res = await fetch(`${baseApi}/products/${id}`)

        if (!res.ok) return NextResponse.json({ message: "Not found" }, { status: res.status })

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}

// PATCH /api/products/:id (Standard for "Only Update" / Partial Update)
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const body = await req.json()

        const res = await fetch(`${baseApi}/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { message: "Update failed", detail: data },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: "Internal update error" }, { status: 500 })
    }
}

// DELETE /api/products/:id
export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const res = await fetch(`${baseApi}/products/${id}`, { method: "DELETE" })

        // Handle empty responses (204 No Content) gracefully
        const text = await res.text()
        const data = text ? JSON.parse(text) : { success: true }

        if (!res.ok) {
            return NextResponse.json(
                { message: "Delete failed", detail: data },
                { status: res.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: "Delete error" }, { status: 500 })
    }
}

// PUT /api/products/:id (Full Replacement Fallback)
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const body = await req.json()

        // 1. Fetch current state to ensure we don't lose data on a PUT
        const existingRes = await fetch(`${baseApi}/products/${id}`)
        if (!existingRes.ok) return NextResponse.json({ message: "Product not found" }, { status: 404 })

        const existingData = await existingRes.json()

        // 2. Merge existing with changes
        const mergedData = { ...existingData, ...body }

        // 3. Save full object
        const res = await fetch(`${baseApi}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mergedData),
        })

        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        return NextResponse.json({ message: "PUT update failed" }, { status: 500 })
    }
}