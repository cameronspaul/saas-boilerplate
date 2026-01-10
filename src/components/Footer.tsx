import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "./icons/Icons";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about-us" },
                { label: "Contact", href: "/contact" },
                { label: "Pricing", href: "/pricing" },
                { label: "Blog", href: "/blog" },
            ]
        },
        {
            title: "Support",
            links: [
                { label: "Help & Support", href: "/help-support" },
                { label: "FAQ", href: "/faq" },
                { label: "Report & Block", href: "/report-block-functionality" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "Community Guidelines", href: "/community-guidelines" },
            ]
        },
        {
            title: "Policies",
            links: [
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Cancellation Policy", href: "/cancellation-policy" },
                { label: "Safety & Security", href: "/safety-and-security" },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="relative border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-5 gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-1 space-y-6">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <img src="/icon.svg" alt="Logo" className="w-8 h-8" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                                Saas Boilerplate
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Building the next generation of SaaS tools with modern technology and elegant design.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                                <Icon name="X" pack="simple-icons" size={18} themeReactive />
                            </a>
                            <a href="https://github.com/cameronspaul" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                                <Icon name="Github" pack="simple-icons" size={18} themeReactive />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section) => (
                        <motion.div key={section.title} className="space-y-5" variants={itemVariants}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="relative">
                                                {link.label}
                                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className="mt-16 pt-8 border-t border-border/40"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/icon.svg" alt="Icon" className="w-5 h-5 opacity-50" />
                            <p className="text-xs text-muted-foreground">
                                © {currentYear} Saas Boilerplate. Built by <a href="https://github.com/cameronspaul" target="_blank" rel="noreferrer" className="underline hover:text-foreground transition-colors">Cameron Paul</a>.
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                                Fast • Secure • Scalable
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
