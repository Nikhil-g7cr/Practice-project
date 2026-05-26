import { Link } from "react-router-dom";
import notfound from "../../../public/NotFound.png";

const NotFoundPage = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${notfound})` }}
    >

      <button className="px-6 py-2 bg-white text-white rounded hover:bg-blue-700 transition">
        <Link to="/">Go Back</Link>
      </button>
    </div>
  );
};

export default NotFoundPage;
