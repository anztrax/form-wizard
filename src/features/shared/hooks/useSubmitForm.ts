import { useMutation } from "@tanstack/react-query";
import { postBasicInfo, BasicInfoPayload } from "../api/basicInfoApi";
import { postDetails, DetailsPayload } from "../api/detailsApi";

export function useSubmitBasicInfo() {
  return useMutation({
    mutationFn: (data: BasicInfoPayload) => postBasicInfo(data),
    onSuccess: () => {
      console.log("✅ basicInfo saved!");
    },
    onError: (error) => {
      console.error("❌ Failed to submit basic info:", error);
    },
  });
}

export function useSubmitDetails() {
  return useMutation({
    mutationFn: (data: DetailsPayload) => postDetails(data),
    onSuccess: () => {
      console.log("✅ details saved!");
    },
    onError: (error) => {
      console.error("❌ Failed to submit details:", error);
    },
  });
}
