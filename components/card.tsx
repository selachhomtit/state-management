"use client"
import { decrement, increment } from "@/lib/features/counter/counterSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

export default function Card() {
    // get global state here
    const count = useAppSelector((state) => state.counter.value)
    // dispatch action here
    const dispatch = useAppDispatch()
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-white shadow-xl rounded-lg p-6 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold mb-4">Calling Global State: {count}</p>
                <div className="flex space-x-4">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => dispatch(decrement())}
                    >
                        Decrease Button
                    </button>
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => dispatch(increment())}
                    >
                        Increase Button
                    </button>
                </div>
            </div>
        </div>
    )
}