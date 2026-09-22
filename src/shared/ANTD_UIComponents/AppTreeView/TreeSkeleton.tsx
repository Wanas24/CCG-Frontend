import AppSkeleton from "../AppSkeleton/AppSkeleton";

const TreeSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex gap-2 items-center! justify-center!">
          <AppSkeleton.Avatar
            active
            shape="square"
            size={20}
            style={{ borderRadius: 6 }}
          />
          <AppSkeleton
            active
            title={{ width: "100%" }}
            paragraph={{ rows: 0, className: "hidden!" }}
          />
        </div>
      ))}
    </div>
  );
};

export default TreeSkeleton;
