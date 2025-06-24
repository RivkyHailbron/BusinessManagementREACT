import { Link } from 'react-router-dom';

export const SignUpSignIn: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row space-x-4">
        <Link to="/signup">
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}
