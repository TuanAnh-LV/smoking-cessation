import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CoachUserService } from "../../../services/coachuser.service";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColor = {
  ongoing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  not_started: "bg-gray-100 text-gray-800",
};

const CoachUserDetail = () => {
  const { id } = useParams();
  const [relation, setRelation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    CoachUserService.getById(id)
      .then((res) => setRelation(res.data))
      .catch((err) => console.error("Failed to fetch detail:", err));
  }, [id]);

  if (!relation)
    return <div className="p-6 animate-pulse text-gray-500">Loading...</div>;

  const { coach_id, user_id, status, created_at, quitPlans } = relation;

  return (
    <div className="p-8 space-y-10 mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline text-sm text-blue-600 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <h1 className="text-3xl font-bold">Client Plan Overview</h1>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-600">User</h2>
          <p className="text-gray-900 font-medium">{user_id?.full_name}</p>
          <p className="text-sm text-gray-500">{user_id?.email}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-600">Coach</h2>
          <p className="text-gray-900 font-medium">{coach_id?.full_name}</p>
          <p className="text-sm text-gray-500">{coach_id?.email}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold text-gray-600">Assignment</h2>
          <p className="text-gray-900 font-medium capitalize">{status}</p>
          <p className="text-sm text-gray-500">
            {new Date(created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quit Plans */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">Quit Plans</h2>
        {quitPlans?.length > 0 ? (
          quitPlans.map((plan) => (
            <div
              key={plan._id}
              className="rounded-xl bg-white shadow p-6 space-y-4 border border-blue-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-blue-700">
                    {plan.goal.replace("_", " ").toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {plan.note || "No note provided."}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    statusColor[plan.status]
                  }`}
                >
                  {plan.status.replace("_", " ")}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(plan.start_date).toLocaleDateString()}
                </p>
                {plan.reasons?.length > 0 && (
                  <p>
                    <strong>Reasons:</strong> {plan.reasons.join(", ")}
                  </p>
                )}
                {plan.reasons_detail && (
                  <p>
                    <strong>Details:</strong> {plan.reasons_detail}
                  </p>
                )}
              </div>

              {/* Stages */}
              <div className="mt-4 space-y-3">
                <h4 className="text-md font-semibold text-gray-700">Stages</h4>
                {plan.stages?.length > 0 ? (
                  plan.stages.map((stage) => (
                    <div
                      key={stage._id}
                      className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
                    >
                      <div className="flex justify-between">
                        <p className="font-semibold text-gray-800">
                          {stage.name}
                        </p>
                        <span
                          className={`text-xs rounded px-2 py-0.5 ${
                            statusColor[stage.status]
                          }`}
                        >
                          {stage.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line mt-1">
                        {stage.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(stage.start_date).toLocaleDateString()} →{" "}
                        {new Date(stage.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-400 text-sm">
                    No stages available.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="italic text-gray-500">No quit plans available.</p>
        )}
      </div>
    </div>
  );
};

export default CoachUserDetail;
