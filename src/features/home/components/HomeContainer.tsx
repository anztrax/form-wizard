"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/common/components/button/Button";
import styles from "./HomeContainer.module.css";

export function HomeContainer() {
  const router = useRouter();

  const handleAddAdmin = () => {
    router.push("/wizard");
  };

  const handleAddOps = () => {
    router.push("/wizard?role=ops");
  };

  const handleShowEmployeeList = () => {
    router.push("/employees");
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles["home-container__content"]}>
        <header className={styles["home-container__header"]}>
          <h1 className={styles["home-container__title"]}>
            Employee Management System
          </h1>
          <p className={styles["home-container__subtitle"]}>
            Manage your employees and personnel efficiently
          </p>
        </header>

        <div className={styles["home-container__actions"]}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddAdmin}
            className={styles["home-container__button"]}
          >
            Add Admin Personnel
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleAddOps}
            className={styles["home-container__button"]}
          >
            Add Ops Personnel
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleShowEmployeeList}
            className={styles["home-container__button"]}
          >
            Show Employee List
          </Button>
        </div>
      </div>
    </div>
  );
}
