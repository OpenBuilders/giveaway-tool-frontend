export const Layout = ({
  children,
  icon,
  title,
  description,
  titleSpace = false,
}: {
  children: React.ReactNode;
  icon?: string;
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  titleSpace?: boolean;
}) => (
  <main className="flex flex-col justify-between h-full overflow-y-auto">
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      {icon && <img src={icon} alt="icon" />}

      <div className="flex flex-col gap-3 items-center justify-center text-center">
        <h1
          className={`text-title text-3xl font-bold tracking-title ${
            titleSpace ? "px-6 py-10" : ""
        }`}
        >
          {title}
        </h1>
        {description && <p className="tracking-footnote">{description}</p>}
      </div>

      {children && <div className="flex flex-col gap-6 w-full">{children}</div>}
    </div>
  </main>
);
