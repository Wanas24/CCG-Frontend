import CreateOrJoinCompanyView from "../components/CreateOrJoinCompanyView";

const CreateOrJoinCompanyPage = () => {
  return (
    <div className="flex min-h-dvh items-center bg-(--app-bg) px-4 py-8 text-(--app-text) sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <CreateOrJoinCompanyView />
      </div>
    </div>
  );
};

export default CreateOrJoinCompanyPage;
