import { cn } from "@/lib/utils";

type BaseHeadingProps = React.ComponentPropsWithoutRef<"div">;

interface HeadingProps extends BaseHeadingProps {
    title: string;
    description: string;
    variant?: string;
}

export const Heading: React.FC<HeadingProps> = ({
    className,
    title,
    description,
    variant = "subheading",
}) => {
    let titleFontSize = "text-3xl";
    let descriptionFontSize = "text-sm";
    let bottomPadding = "pb-2";
    if (variant === "heading") {
        titleFontSize = "text-5xl";
        descriptionFontSize = "text-base";
        bottomPadding = "pb-4";
    }

    return (
        <div className={cn(bottomPadding, className)}>
            <h2 className={cn("font-bold tracking-tight", titleFontSize)}>
                {title}
            </h2>
            <p className={cn("text-muted-foreground", descriptionFontSize)}>
                {description}
            </p>
        </div>
    );
};
