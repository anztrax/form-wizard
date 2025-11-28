import { useMutation } from "@tanstack/react-query";
import { postBasicInfo } from "../api/basicInfoApi";
import { postDetail } from "../api/detailsApi";
import { BasicInfoPayload } from "../models/BasicInfoModel";
import { DetailPayload } from "../models/DetailInfoModel";

export function useSubmitBasicInfoMutation() {
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

export function useSubmitDetailMutation() {
  return useMutation({
    mutationFn: (data: DetailPayload) => postDetail(data),
    onSuccess: () => {
      console.log("✅ detail saved!");
    },
    onError: (error) => {
      console.error("❌ Failed to submit detail:", error);
    },
  });
}
