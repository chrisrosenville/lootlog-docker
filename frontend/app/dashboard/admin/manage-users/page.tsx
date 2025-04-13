"use client";
import { useState } from "react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { useModalStore } from "@/store/modal-store";

import { LoadingScreen } from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/apiClient";

export default function ManageUsersPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await apiClient.fetch("/users"),
  });

  const modal = useModalStore();

  const handleDeleteUser = async (id: number) => {};

  const onPressDelete = async (id: number) => {
    modal.show(
      "Delete user",
      `Are you sure you want to delete this user?`,
      "Cancel",
      () => handleDeleteUser(id),
      (deleteUser) => <Button onClick={deleteUser}>Delete</Button>,
    );
  };

  if (!data?.users) return <LoadingScreen />;

  return (
    <div>
      {errorMessage && (
        <p className="text-center text-red-600">{errorMessage}</p>
      )}
      <Table className="rounded-md bg-neutral-900">
        <TableCaption>All users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.users &&
            data?.users.map((user) => (
              <TableRow key={user?.id}>
                <TableCell>{user?.id}</TableCell>
                <TableCell>{user?.userName}</TableCell>
                <TableCell>{user?.firstName}</TableCell>
                <TableCell>{user?.lastName}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`users/${user?.id}`}>
                    <Button className="bg-neutral-300 hover:bg-neutral-500">
                      Manage
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-600 text-neutral-100 hover:bg-red-800"
                    onClick={() => onPressDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
