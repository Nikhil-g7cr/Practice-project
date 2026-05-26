const ErrorDisplay = ({ErrorMessage}: {ErrorMessage: string;}) => {
  return (
    <div className="mb-4 p-3 text-amber-900 bg-error-container border border-error rounded-lg  text-sm">
      {ErrorMessage}
    </div>
  );
};

export default ErrorDisplay;
