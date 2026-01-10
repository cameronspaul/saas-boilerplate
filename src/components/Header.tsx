import { useAppStore } from '../stores/useAppStore'
import { Sun, Moon } from 'lucide-react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useConvexAuth, useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { Icon } from './icons/Icons'
import { Link, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LayoutDashboard, Settings as SettingsIcon, LogOut } from 'lucide-react'

export default function Header() {
  const { theme, toggleTheme } = useAppStore()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const user = useQuery(api.users.getCurrentUser)
  const { signIn, signOut } = useAuthActions()
  const location = useLocation()

  const handleSignIn = async (provider: 'github' | 'google') => {
    await signIn(provider)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Animation variants for staggered button entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }

  const navLinks: { href: string; label: string; requiresAuth?: boolean }[] = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <header className="w-full bg-background border-b border-border px-4 h-16 flex items-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        {/* Logo/Brand */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/icon.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-foreground">Saas Boilerplate</h1>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          className="hidden md:flex items-center space-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {navLinks.map((link) => {
            if (link.requiresAuth && !isAuthenticated) return null
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </motion.nav>

        {/* Right side - Auth buttons and theme toggle */}
        <motion.div
          className="flex items-center space-x-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {!isLoading && !isAuthenticated && (
              <motion.div
                key="auth-buttons"
                className="flex items-center space-x-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSignIn('google')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Google" pack="developer-icons" size={16} />
                    <span>Google</span>
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSignIn('github')}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Github" pack="simple-icons" size={16} themeReactive />
                    <span>GitHub</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {isAuthenticated && !isLoading && user !== undefined && (
              <motion.div
                key="user-menu"
                className="flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:bg-transparent focus-visible:ring-0 shadow-none border-none">
                      <Avatar className="h-10 w-10 border border-border transition-transform hover:scale-105">
                        <AvatarImage src={user?.image} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {(user?.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/" className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Home</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/dashboard" className="flex items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/settings" className="flex items-center">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <motion.div
            className="flex items-center"
            variants={buttonVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="flex items-center gap-2"
            >
              <motion.div
                key={theme}
                className="flex items-center justify-center pointer-events-none"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </motion.div>
              <span className="font-medium leading-none">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}