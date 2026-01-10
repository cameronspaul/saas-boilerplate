import React from 'react';
import * as SimpleIcons from 'simple-icons';
import * as DeveloperIcons from 'developer-icons';
import { useAppStore } from '@/stores/useAppStore';

export type IconPackType = 'simple-icons' | 'developer-icons' | 'local-svg';

export interface TechIconProps {
    /**
     * The exact icon name from the pack:
     * - For developer-icons: use the exact export name (e.g., 'React', 'ViteJS', 'TypeScript')
     * - For simple-icons: prefix 'si' is optional (e.g., 'Github', 'React', 'siGithub')
     * - For local-svg: use the path relative to public (e.g., '/templateimages/react.svg')
     */
    name: string;
    /** Size of the icon in pixels */
    size?: number;
    /** Which icon pack to use */
    pack: IconPackType;
    /** Additional CSS classes */
    className?: string;
    /** Custom color (hex with or without #) - for simple-icons */
    color?: string;
    /** Whether to use the brand's original color (default: true for simple-icons) */
    useOriginalColor?: boolean;
    /** Additional inline styles */
    style?: React.CSSProperties;
    /** Alt text for accessibility */
    alt?: string;
    /**
     * When true, the icon color will automatically adapt to the theme:
     * - In dark mode: icon becomes white (#ffffff)
     * - In light mode: icon becomes black (#000000)
     * This overrides color and useOriginalColor when enabled.
     */
    themeReactive?: boolean;
}

/**
 * Icon - A universal icon component supporting multiple icon packs
 * 
 * Uses the EXACT name as exported from the icon pack. If the icon doesn't exist, returns null.
 * 
 * @example
 * // Using developer-icons - use exact export names
 * <TechIcon name="React" pack="developer-icons" size={32} />
 * <TechIcon name="TypeScript" pack="developer-icons" size={24} />
 * <TechIcon name="ViteJS" pack="developer-icons" size={24} />
 * <TechIcon name="TailwindCSS" pack="developer-icons" size={24} />
 * 
 * // Using simple-icons - prefix 'si' is optional
 * <TechIcon name="Github" pack="simple-icons" size={32} />
 * <TechIcon name="siReact" pack="simple-icons" size={32} />
 * 
 * // Using local SVG
 * <TechIcon name="/templateimages/react.svg" pack="local-svg" size={32} />
 * 
 * // With custom color (simple-icons only)
 * <TechIcon name="Github" pack="simple-icons" size={24} color="#ffffff" />
 * 
 * // Theme-reactive icons - automatically switch color based on theme
 * // In dark mode: white, in light mode: black
 * <TechIcon name="Github" pack="simple-icons" size={24} themeReactive />
 * <TechIcon name="React" pack="developer-icons" size={24} themeReactive />
 */
export function Icon({
    name,
    size = 24,
    pack,
    className = '',
    color,
    useOriginalColor = true,
    style,
    alt,
    themeReactive = false,
}: TechIconProps) {
    const theme = useAppStore((state) => state.theme);

    // Determine theme-reactive color
    const getThemeReactiveColor = () => {
        if (!themeReactive) return null;
        return theme === 'dark' ? '#ffffff' : '#000000';
    };

    const themeColor = getThemeReactiveColor();

    // Local SVG - use CSS filter for theme-reactive coloring
    if (pack === 'local-svg') {
        const themeReactiveStyle = themeReactive ? {
            filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) invert(0)',
        } : {};
        return (
            <img
                src={name}
                width={size}
                height={size}
                className={className}
                style={{ ...themeReactiveStyle, ...style }}
                alt={alt || name.split('/').pop()?.replace('.svg', '') || 'icon'}
            />
        );
    }

    // Developer Icons - use exact name
    if (pack === 'developer-icons') {
        const IconComponent = (DeveloperIcons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name];

        if (IconComponent) {
            // For developer-icons, we can apply a CSS filter for theme-reactive coloring
            const themeReactiveStyle = themeColor ? {
                filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) invert(0)',
            } : {};
            return (
                <IconComponent
                    className={className}
                    style={{ width: size, height: size, ...themeReactiveStyle, ...style }}
                />
            );
        }

        // Icon not found - return null
        return null;
    }

    // Simple Icons - handle prefixing automatically
    const normalizedName = name.startsWith('si') ? name : `si${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const icon = (SimpleIcons as Record<string, SimpleIcons.SimpleIcon>)[normalizedName];

    if (!icon) {
        // Fallback: try raw name just in case
        const rawIcon = (SimpleIcons as Record<string, SimpleIcons.SimpleIcon>)[name];
        if (!rawIcon) return null;

        // Use rawIcon if found
        return (
            <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                className={className}
                style={{ fill: themeColor || (color ? (color.startsWith('#') ? color : `#${color}`) : (useOriginalColor ? `#${rawIcon.hex}` : 'currentColor')), ...style }}
                aria-label={alt || rawIcon.title}
            >
                <title>{alt || rawIcon.title}</title>
                <path d={rawIcon.path} />
            </svg>
        );
    }

    // Determine color - themeColor takes priority when themeReactive is enabled
    let fillColor: string;
    if (themeColor) {
        fillColor = themeColor;
    } else if (color) {
        fillColor = color.startsWith('#') ? color : `#${color}`;
    } else if (useOriginalColor) {
        fillColor = `#${icon.hex}`;
    } else {
        fillColor = 'currentColor';
    }

    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={className}
            style={{ fill: fillColor, ...style }}
            aria-label={alt || icon.title}
        >
            <title>{alt || icon.title}</title>
            <path d={icon.path} />
        </svg>
    );
}

export default Icon;
