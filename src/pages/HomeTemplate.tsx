// IF THIS IS YOUR FIRST TIME EDITING THIS FILE, SO IF YOU CAN READ THIS, make a new file without the "template" prefix

import { Icon } from '../components/icons/Icons'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'
import { PageSEO } from '@/components/SEO'

function Home() {

  return (
    <>
      <PageSEO.Home />
      <div className="flex flex-col items-center justify-center py-16">

        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-12 max-w-4xl px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.a href="https://vite.dev" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="ViteJS" pack="developer-icons" size={64} />
            </motion.div>
          </motion.a>
          <motion.a href="https://react.dev" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="React" pack="developer-icons" size={64} />
            </motion.div>
          </motion.a>
          <motion.a href="https://tailwindcss.com/" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="TailwindCSS" pack="developer-icons" size={64} />
            </motion.div>
          </motion.a>
          <motion.a href="https://shadcn.com/" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="ShadcnUI" pack="developer-icons" size={64} themeReactive />
            </motion.div>
          </motion.a>
          <motion.a href="https://polar.sh/" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="/templateimages/polarsh.svg" pack="local-svg" size={64} themeReactive />
            </motion.div>
          </motion.a>
          <motion.a href="https://convex.dev/" target="_blank"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name="Convex" pack="developer-icons" size={64} />
            </motion.div>
          </motion.a>
        </motion.div>

        <motion.div className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button>Hello</Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-lg font-medium opacity-80 space-y-1 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 1.2,
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.a href="https://www.npmjs.com/package/vite" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Vite</motion.a>
          <motion.a href="https://www.npmjs.com/package/react" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >React</motion.a>
          <motion.a href="https://www.npmjs.com/package/framer-motion" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Framer Motion</motion.a>
          <motion.a href="https://www.npmjs.com/package/tailwindcss" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Tailwind CSS</motion.a>
          <motion.a href="https://www.npmjs.com/package/shadcn-ui" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Shadcn UI</motion.a>
          <motion.a href="https://www.npmjs.com/package/convex" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Convex</motion.a>
          <motion.a href="https://www.npmjs.com/package/@convex-dev/auth" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Convex Auth</motion.a>
          <motion.a href="https://www.npmjs.com/package/@polar-sh/sdk" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Polar SDK</motion.a>
          <motion.a href="https://www.npmjs.com/package/resend" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Resend</motion.a>
          <motion.a href="https://www.npmjs.com/package/posthog-js" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >PostHog</motion.a>
          <motion.a href="https://www.npmjs.com/package/react-ga4" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Google Analytics 4</motion.a>
          <motion.a href="https://www.npmjs.com/package/@vercel/analytics" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Vercel Analytics</motion.a>
          <motion.a href="https://www.npmjs.com/package/react-router-dom" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >React Router DOM</motion.a>
          <motion.a href="https://www.npmjs.com/package/zustand" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Zustand</motion.a>
          <motion.a href="https://www.npmjs.com/package/lucide-react" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Lucide React</motion.a>
          <motion.div className="flex space-x-1 justify-center"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <a href="https://www.npmjs.com/package/simple-icons" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline">Simple Icons</a>
            <span className="text-foreground">&</span>
            <a href="https://www.npmjs.com/package/developer-icons" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline">Developer Icons</a>
            <span className="text-foreground">System</span>
          </motion.div>
          <motion.a href="https://www.npmjs.com/package/npm-check-updates" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors underline block"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Check for npm updates</motion.a>
          <motion.div className="text-foreground"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Theme Toggle</motion.div>
          <motion.div className="text-foreground"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >SEO System (Metadata, JSON-LD, Sitemap)</motion.div>
          <motion.div className="text-foreground"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Blog System - Generate AI Blogs (they're actually good)</motion.div>
          <motion.div className="text-foreground"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Full Content Pages (About, Contact, FAQ, Help & Support)</motion.div>
          <motion.div className="text-foreground"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >Comprehensive .gitignore</motion.div>
        </motion.div>
      </div >
    </>
  )
}

export default Home