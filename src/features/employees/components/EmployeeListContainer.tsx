"use client";

import { useState } from "react";
import { PaginationState, ColumnDef } from "@tanstack/react-table";
import { Table } from "@/common/components/table/Table";
import { useEmployeesQuery } from "@/features/shared/hooks/useEmployeesQuery";
import { EmployeeModel } from "@/features/shared/models/EmployeeModel";
import { ImagePreviewModal } from "./ImagePreviewModal";
import styles from "./EmployeeListContainer.module.css";
import { Button } from "@/common/components/button/Button";
import { useRouter } from "next/navigation";

type ImagePreviewState = {
  isOpen: boolean;
  imageUrl: string;
  employeeName: string;
};

export function EmployeeListContainer() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
    isOpen: false,
    imageUrl: "",
    employeeName: "",
  });

  const handleImageClick = (imageUrl: string, employeeName: string) => {
    setImagePreview({
      isOpen: true,
      imageUrl,
      employeeName,
    });
  };

  const handleCloseModal = () => {
    setImagePreview({
      isOpen: false,
      imageUrl: "",
      employeeName: "",
    });
  };

  const handleClickAddEmployee = () => {
    router.push("/wizard?role=ops");
  };

  const { data, isPending, isError, error } = useEmployeesQuery({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  const columns: ColumnDef<EmployeeModel>[] = [
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "photo",
      header: "Photo",
      cell: (info) => {
        const photo = info.getValue() as unknown as string;
        const row = info.row.original;
        return photo && photo !== "N/A" ? (
          <img
            src={photo}
            alt="Employee"
            className={styles["employee-list-container__photo"]}
            onClick={() => handleImageClick(photo, row.fullName)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(photo, row.fullName);
              }
            }}
          />
        ) : (
          <span className={styles["employee-list-container__no-photo"]}>
            No Photo
          </span>
        );
      },
    },
  ];

  const handlePaginationChange = (newPagination: PaginationState) => {
    setPagination(newPagination);
  };

  const employeeData: EmployeeModel[] = data.employees || [];

  if (isError) {
    return (
      <div className={styles["employee-list-container"]}>
        <div className={styles["employee-list-container__error"]}>
          Error loading employees: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles["employee-list-container"]}>
      <div className={styles["employee-list-container__header"]}>
        <div className={styles["employee-list-container__header-content"]}>
          <div className={styles["employee-list-container__header-text"]}>
            <h1 className={styles["employee-list-container__title"]}>Employee List</h1>
            <p className={styles["employee-list-container__subtitle"]}>
              {data.details?.total} employees found
            </p>
          </div>
          <Button variant="outline" onClick={handleClickAddEmployee}>
            + Add Employee
          </Button>
        </div>
      </div>

      <div className={styles["employee-list-container__content"]}>
        <Table
          data={employeeData}
          columns={columns}
          enablePagination={true}
          manualPagination={true}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={data.details?.totalPages}
          totalRows={data.details?.total}
          onPaginationChange={handlePaginationChange}
          isLoading={isPending}
          emptyMessage="No employees found"
        />
      </div>

      <ImagePreviewModal
        isOpen={imagePreview.isOpen}
        onClose={handleCloseModal}
        imageUrl={imagePreview.imageUrl}
        employeeName={imagePreview.employeeName}
      />
    </div>
  );
}
