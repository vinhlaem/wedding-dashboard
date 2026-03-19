"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";

type Account = {
  _id?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
};

const fetchAccounts = async () => {
  const res = await api.get("/api/accounts");
  return res.data?.data || [];
};

export default function GiftManager() {
  const [selected, setSelected] = useState<Account | null>(null);
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const createMut = useMutation({
    mutationFn: (payload: Account) => api.post("/api/accounts", payload),
    onSuccess: () => {
      toast.success("Account created");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => toast.error("Create failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Account }) =>
      api.put(`/api/accounts/${id}`, payload),
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/api/accounts/${id}`),
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setSelected(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  const createNew = () =>
    setSelected({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    });

  const save = () => {
    if (!selected) return;
    if (selected._id) {
      updateMut.mutate({ id: selected._id, payload: selected });
    } else {
      createMut.mutate(selected);
    }
  };

  const remove = () => {
    if (!selected || !selected._id)
      return toast.error("Select an account to delete");
    if (!confirm("Xác nhận xóa tài khoản này?")) return;
    deleteMut.mutate(selected._id);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Quà cưới / Tài khoản
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý các tài khoản (vợ / chồng) hiển thị trên trang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Danh sách tài khoản</h3>
            <button
              className="btn bg-rose-500 text-white px-3 py-1 rounded"
              onClick={createNew}
            >
              Thêm
            </button>
          </div>

          <div className="space-y-2">
            {!isLoading && accounts.length === 0 && (
              <div className="text-sm text-gray-500">Chưa có tài khoản.</div>
            )}
            {accounts.map((a) => (
              <div
                key={a._id}
                className={`p-3 border rounded cursor-pointer ${selected?._id === a._id ? "border-rose-400 bg-rose-50" : "border-gray-200"}`}
                onClick={() => setSelected(a)}
              >
                <div className="font-medium">{a.bankName || "Không tên"}</div>
                <div className="text-sm text-gray-600">
                  {a.accountHolder || ""} • {a.accountNumber || ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  Ngân hàng
                </div>
                <input
                  className="input border border-gray-300 text-gray-900"
                  value={selected?.bankName || ""}
                  onChange={(e) =>
                    setSelected({ ...selected!, bankName: e.target.value })
                  }
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  Số tài khoản
                </div>
                <input
                  className="input border border-gray-300 text-gray-900"
                  value={selected?.accountNumber || ""}
                  onChange={(e) =>
                    setSelected({ ...selected!, accountNumber: e.target.value })
                  }
                />
              </label>

              <label className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  Tên tài khoản
                </div>
                <input
                  className="input border border-gray-300 text-gray-900"
                  value={selected?.accountHolder || ""}
                  onChange={(e) =>
                    setSelected({ ...selected!, accountHolder: e.target.value })
                  }
                />
              </label>

             
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-primary bg-rose-500 px-4 py-2 rounded-lg text-white hover:bg-rose-600 disabled:bg-gray-400"
                onClick={save}
                disabled={
                  createMut.isPending ||
                  updateMut.isPending ||
                  !selected ||
                  !selected.bankName ||
                  !selected.accountHolder ||
                  !selected.accountNumber
                }
              >
                {createMut.isPending || updateMut.isPending ? "Saving..." : "Save"}
              </button>
              <button
                className="btn bg-gray-200 px-4 py-2 rounded-lg"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ["accounts"] })
                }
              >
                Refresh
              </button>
              <button
                className="btn bg-red-500 text-white px-4 py-2 rounded-lg ml-auto"
                onClick={remove}
                disabled={deleteMut.isPending || !selected || !selected._id}
              >
                {deleteMut.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
