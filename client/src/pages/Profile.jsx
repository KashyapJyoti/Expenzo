import React, { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency } from "../utils/currency.js";
import { Loader } from "../components/ui/Loader.jsx";

export const ProfilePage = () => {
  const { user, refreshUser, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    monthlyBudget: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [createdAt, setCreatedAt] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const profile = res.data?.user;
        const status = res.data?.budgetStatus;
        if (profile) {
          setForm((prev) => ({
            ...prev,
            name: profile.name || "",
            email: profile.email || "",
            bio: profile.bio || "",
            monthlyBudget:
              typeof profile.monthlyBudget === "number"
                ? String(profile.monthlyBudget)
                : "",
            avatar: profile.avatar || "",
            password: "",
            confirmPassword: "",
          }));
          setCreatedAt(profile.createdAt || null);
          setUser(profile);
        }
        if (status) setBudgetStatus(status);
      } catch (error) {
        console.error(error);
        showToast("error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        bio: form.bio,
        monthlyBudget: form.monthlyBudget ? Number(form.monthlyBudget) : 0,
      };
      if (form.password) {
        payload.password = form.password;
      }
      const res = await api.put("/users/profile", payload);
      const profile = res.data?.user;
      const status = res.data?.budgetStatus;
      if (profile) {
        setUser(profile);
        await refreshUser();
        setForm((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
          monthlyBudget:
            typeof profile.monthlyBudget === "number"
              ? String(profile.monthlyBudget)
              : "",
        }));
      }
      if (status) setBudgetStatus(status);
      showToast("success", "Profile updated");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Failed to update profile";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSave = async () => {
    setAvatarSaving(true);
    try {
      const res = await api.put("/users/avatar", { avatar: form.avatar });
      const profile = res.data?.user;
      const status = res.data?.budgetStatus;
      if (profile) {
        setUser(profile);
        await refreshUser();
      }
      if (status) setBudgetStatus(status);
      showToast("success", "Avatar updated");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Failed to update avatar";
      showToast("error", message);
    } finally {
      setAvatarSaving(false);
    }
  };

  const monthLabel =
    budgetStatus?.monthLabel &&
    `${budgetStatus.monthLabel.split("-")[1]} / ${
      budgetStatus.monthLabel.split("-")[0]
    }`;

  const createdLabel =
    createdAt &&
    new Date(createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  if (loading) {
    return (
      <AppLayout>
        <Loader label="Loading your profile" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your personal details, budget and account security.
            </p>
          </div>
          {createdLabel && (
            <p className="text-[11px] text-slate-500">
              Member since{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {createdLabel}
              </span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-5">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="card flex items-center gap-4">
              <div className="relative">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt={form.name || "Avatar"}
                    className="h-16 w-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    onError={() =>
                      setForm((prev) => ({
                        ...prev,
                        avatar: "",
                      }))
                    }
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xl font-semibold dark:bg-slate-800 dark:text-slate-100">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-50">
                    {form.name || "Your name"}
                  </p>
                  <p className="text-xs text-slate-500">{form.email}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input
                    type="url"
                    name="avatar"
                    className="input h-9 text-xs"
                    placeholder="Avatar image URL"
                    value={form.avatar}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    disabled={avatarSaving}
                    onClick={handleAvatarSave}
                    className="btn btn-outline h-9 text-xs"
                  >
                    {avatarSaving ? "Saving..." : "Save avatar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input h-9 text-sm"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input h-9 text-sm bg-slate-100 dark:bg-slate-900/60"
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  className="input text-xs resize-none"
                  placeholder="Short line about how you think about money..."
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Monthly budget (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyBudget"
                    min="0"
                    className="input h-9 text-sm"
                    value={form.monthlyBudget}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="card space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-50">
                  Change password
                </p>
                <p className="text-[11px] text-slate-500">
                  Leave blank if you don&apos;t want to change it.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    New password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input h-9 text-sm"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input h-9 text-sm"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary text-xs px-5"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-50">
                    Monthly budget status
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Based on this month&apos;s expenses.
                  </p>
                </div>
              </div>
              {budgetStatus && budgetStatus.budget > 0 ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                      {formatCurrency(budgetStatus.budget)}
                    </p>
                    <p className="text-xs text-slate-500">
                      planned for {monthLabel || "this month"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Used</span>
                      <span>
                        {formatCurrency(
                          budgetStatus.totalExpensesThisMonth || 0
                        )}{" "}
                        ({Math.round(budgetStatus.usedPercent || 0)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          budgetStatus.exceeded ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(budgetStatus.usedPercent || 0)
                          )}%`,
                        }}
                      />
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        budgetStatus.exceeded
                          ? "text-red-500"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {budgetStatus.exceeded
                        ? "You have exceeded your monthly budget. Review your high-impact categories in the dashboard."
                        : `You have approximately ${formatCurrency(
                            budgetStatus.remaining || 0
                          )} left to spend this month.`}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Set a monthly budget to see how your spending tracks against
                  it.
                </p>
              )}
            </div>
          </div>
        </div>

        {toast && (
          <div
            className={`fixed bottom-4 right-4 z-40 rounded-xl px-4 py-2 text-xs shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

