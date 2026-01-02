import { Loader } from "@/components/ui/loader"

export default function Loading() {
    return (
        <div className="h-full w-full min-h-[50vh] flex items-center justify-center">
            <Loader />
        </div>
    )
}
