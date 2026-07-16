import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

const api = axios.create({
  baseURL:import.meta.env.VITE_URL_API,
});

function App() {
  // State variables
  const [areaTypes, setAreaTypes] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);

  // Loading & Error states
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  //state variables for predicted price
  const [predictedPrice, setPredictedPrice] = useState(null);

  //helper state variables for fetching predicted price
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictedPriceError, setPredictedPriceError] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch dropdown options
  useEffect(() => {
    async function fetchOptions() {
      try {
        setIsOptionsLoading(true);
        setOptionsError("");

        const response = await api.get("/options");

        setAreaTypes(response.data.area_type_features);
        setLocationTypes(response.data.location_type_features);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptionsError("Failed to load dropdown options.");
      } finally {
        setIsOptionsLoading(false);
      }
    }

    fetchOptions();
  }, []);

  // Submit Handler
  async function onSubmit(data) {
    try {
      setIsPredicting(true);
      setPredictedPriceError("");
      

      const response = await api.post("/predict", data);

      setPredictedPrice(response.data.prediction);
    } catch (error) {
      console.error("Error occurred while predicting price:", error);
      setPredictedPriceError("Error occurred while predicting price.");
    } finally {
      setIsPredicting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          House Price Predictor
        </h1>

        <p className="mt-3 text-center text-slate-500">
          Enter house details and predict the price using the trained ML model.
        </p>

        {optionsError && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {optionsError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-5"
        >
          {/* Area Type */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Area Type
            </label>

            <select
              disabled={isOptionsLoading}
              {...register("area_type", {
                required: "Area type is required",
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                {isOptionsLoading ? "Loading..." : "Select area type"}
              </option>

              {areaTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {errors.area_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.area_type.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Location
            </label>

            <select
              disabled={isOptionsLoading}
              {...register("location", {
                required: "Location is required",
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                {isOptionsLoading ? "Loading..." : "Select location"}
              </option>

              {locationTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Total Sqft */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Total Sqft
            </label>

            <input
              type="number"
              placeholder="Example: 1170"
              {...register("total_sqft", {
                required: "Total sqft is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Total sqft must be greater than 0",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.total_sqft && (
              <p className="mt-1 text-sm text-red-600">
                {errors.total_sqft.message}
              </p>
            )}
          </div>

          {/* Bath */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Bath
            </label>

            <input
              type="number"
              placeholder="Example: 2"
              {...register("bath", {
                required: "Bath count is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Bath count must be at least 1",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.bath && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bath.message}
              </p>
            )}
          </div>

          {/* BHK */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              BHK
            </label>

            <input
              type="number"
              placeholder="Example: 2"
              {...register("bhk", {
                required: "BHK count is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "BHK count must be at least 1",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.bhk && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bhk.message}
              </p>
            )}
          </div>

          {/* Balcony */}
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Balcony
            </label>

            <input
              type="number"
              placeholder="Example: 1"
              {...register("balcony", {
                required: "Balcony count is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Balcony count cannot be negative",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.balcony && (
              <p className="mt-1 text-sm text-red-600">
                {errors.balcony.message}
              </p>
            )}
          </div>

          <button
          disabled={isPredicting || isOptionsLoading}
            type="submit"
            className="mt-3 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {isPredicting ? "Predicting..." : "Predict Price"}
          </button>
        </form>


        {predictedPriceError && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {predictedPriceError}
        </p>
      )}

      {predictedPrice && (
        <div className="mt-5 rounded-lg bg-green-50 px-4 py-4 text-center">
          <p className="text-sm text-green-700">Predicted Price</p>

          <p className="mt-1 text-3xl font-bold text-green-800">
            {predictedPrice} lakhs
          </p>
        </div>
      )}


      </section>
    </main>
  );
}

export default App;