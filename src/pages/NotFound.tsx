import { Link } from 'react-router-dom'

const NotFound = () => {
  const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME;
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404 ! </h1>
        <p className="text-lg text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go Back to Home
        </Link>
        <p className='text-gray-400 mt-5'>Company @ {COMPANY_NAME}</p>
      </div>
    </div>
  )
}

export default NotFound
