import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Home } from 'lucide-react'
import { PageSEO } from '@/components/SEO'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <PageSEO.NotFound />
            <div className="relative">
                <h1 className="text-[12rem] font-bold text-primary/10 select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h2>
                    <p className="text-muted-foreground text-lg max-w-[500px] mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                    <Button asChild size="lg" className="gap-2">
                        <Link to="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl w-full">
                <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-1">Check the URL</h3>
                    <p className="text-sm text-muted-foreground">Make sure the address is correct</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-1">Search Blog</h3>
                    <p className="text-sm text-muted-foreground">Find what you need in our articles</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-1">Contact Us</h3>
                    <p className="text-sm text-muted-foreground">We're here to help if you're lost</p>
                </div>
            </div>
        </div>
    )
}
