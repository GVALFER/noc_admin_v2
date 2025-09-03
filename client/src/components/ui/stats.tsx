export const Stats = ({ items }: { items: { label: string; value: string | number }[] }) => {
    return (
        <div className="bg-secondary rounded mt-4 p-4 flex items-center justify-between">
            {items.map((stat, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};
