import { NextRequest, NextResponse } from "next/server"

const baseApi = process.env.NEXT_PUBLIC_API

type Params = { params: Promise<{ id: string }> }

// GET /api/products/:id
export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params   // ← await params (Next.js 15)
    const res = await fetch(`${baseApi}/products/${id}`)
    const data = await res.json()
    return NextResponse.json(data)
}

// PUT /api/products/:id
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params   // ← await params (Next.js 15)
    const body = await req.json()
    const res = await fetch(`${baseApi}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data)
}

// DELETE /api/products/:id
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = await params   // ← await params (Next.js 15)
    const res = await fetch(`${baseApi}/products/${id}`, {
        method: "DELETE",
    })

    const text = await res.text()
    const data = text ? JSON.parse(text) : { success: true }

    if (!res.ok) {
        return NextResponse.json(
            { message: "Delete failed", detail: data },
            { status: res.status }
        )
    }

    return NextResponse.json(data, { status: res.status })
}