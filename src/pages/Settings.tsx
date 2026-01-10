import { useState } from "react"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useSubscription } from "../hooks/useSubscription"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Trash2, ExternalLink, MessageSquare, User, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import { PageSEO } from "@/components/SEO"

export default function Settings() {
    const user = useQuery(api.users.getCurrentUser)
    const subscription = useSubscription()
    const generatePortalUrl = useAction(api.polar.generateCustomerPortalUrl)
    const submitFeedback = useMutation(api.feedback.submitFeedback)
    const deleteAccount = useMutation(api.users.deleteUser)

    const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "improvement" | "other">("improvement")
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [isGeneratingPortal, setIsGeneratingPortal] = useState(false)

    const handleManageSubscription = async () => {
        setIsGeneratingPortal(true)
        try {
            const result = await generatePortalUrl()
            if (result && result.url) {
                window.location.href = result.url
            } else {
                toast.error("Failed to generate subscription portal link")
            }
        } catch (error) {
            console.error("Portal error:", error)
            toast.error("An error occurred while opening the subscription portal")
        } finally {
            setIsGeneratingPortal(false)
        }
    }

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!feedbackMessage.trim()) {
            toast.error("Please enter a message")
            return
        }

        setIsSubmittingFeedback(true)
        try {
            await submitFeedback({
                type: feedbackType,
                message: feedbackMessage,
                page: window.location.pathname,
            })
            toast.success("Feedback submitted successfully!")
            setFeedbackMessage("")
        } catch (error) {
            console.error("Feedback error:", error)
            toast.error("Failed to submit feedback")
        } finally {
            setIsSubmittingFeedback(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true)
        try {
            await deleteAccount()
            toast.success("Account deleted successfully")
            window.location.href = "/"
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Failed to delete account")
            setIsDeletingAccount(false)
        }
    }

    if (!user) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4">
            <PageSEO.Settings />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscription" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="hidden sm:inline">Subscription</span>
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Feedback</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>
                                    Your personal information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={user.name || ""} readOnly className="bg-muted cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email || ""} readOnly className="bg-muted cursor-not-allowed" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                <CardDescription>
                                    Permanently delete your account and all associated data.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Delete Account
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => { }}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                                                {isDeletingAccount ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                Delete Permanently
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscription" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>
                                    Manage your subscription and billing details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Plan</p>
                                        <p className="text-2xl font-bold capitalize">{subscription.tier}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                                        <p className="text-lg font-semibold text-primary">
                                            {subscription.isLifetime ? "Lifetime Access" : subscription.hasSubscription ? "Active" : "Free"}
                                        </p>
                                    </div>
                                </div>

                                {subscription.credits !== undefined && (
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
                                        <p className="text-2xl font-bold">{subscription.credits}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleManageSubscription}
                                    disabled={isGeneratingPortal}
                                    className="flex items-center gap-2"
                                >
                                    {isGeneratingPortal ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ExternalLink className="h-4 w-4" />
                                    )}
                                    Manage in Polar
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="feedback" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send Feedback</CardTitle>
                                <CardDescription>
                                    Help us improve by sharing your thoughts or reporting bugs.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmitFeedback}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Feedback Type</Label>
                                        <Select
                                            value={feedbackType}
                                            onValueChange={(val: any) => setFeedbackType(val)}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bug">Bug Report</SelectItem>
                                                <SelectItem value="feature">Feature Request</SelectItem>
                                                <SelectItem value="improvement">Improvement</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us what's on your mind..."
                                            value={feedbackMessage}
                                            onChange={(e) => setFeedbackMessage(e.target.value)}
                                            rows={5}
                                            className="resize-none"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isSubmittingFeedback} className="flex items-center gap-2">
                                        {isSubmittingFeedback ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MessageSquare className="h-4 w-4" />
                                        )}
                                        Submit Feedback
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}
