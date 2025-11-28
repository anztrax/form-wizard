import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FORM_MESSAGES, useFormWizard } from "./useFormWizard";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => "admin",
  }),
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMutateBasicInfo = vi.fn();
const mockMutateDetail = vi.fn();

vi.mock("../../shared/hooks/useSubmitFormMutations", () => ({
  useSubmitBasicInfoMutation: () => ({
    mutateAsync: mockMutateBasicInfo,
  }),
  useSubmitDetailMutation: () => ({
    mutateAsync: mockMutateDetail,
  }),
}));

const mockShowToast = vi.fn();
vi.mock("@/common/components/toast/useToast", () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockShowLoading = vi.fn();
const mockHideLoading = vi.fn();
vi.mock("@/common/components/modal", () => ({
  useLoadingModal: () => ({
    showLoading: mockShowLoading,
    hideLoading: mockHideLoading,
    isLoading: false,
  }),
}));

vi.mock("./useFormDraftPersistence", () => ({
  useFormDraftPersistence: () => ({
    clearDraftAndReset: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryClientWrapper";
  return Wrapper;
};

const adminFormValues = {
  roleType: "admin" as const,
  fullName: "John Doe",
  email: "john@example.com",
  department: "engineering",
  departmentName: "Engineering",
  role: "developer",
  employeeId: "EMP001",
  photo: "data:image/png;base64,abc123",
  employmentType: "full-time",
  location: "jakarta",
  locationName: "Jakarta",
  notes: "Test notes",
};

describe("useFormWizard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockMutateBasicInfo.mockResolvedValue({});
    mockMutateDetail.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("onSubmitForm - Sequential POST + Progress States", () => {
    it("shows initial loading state when form submission starts", async () => {
      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onSubmitForm(adminFormValues);
      });

      expect(mockShowLoading).toHaveBeenCalledWith(FORM_MESSAGES.SUBMITTING_FORM);
    });

    it("submits basicInfo first, then details for admin role", async () => {
      const callOrder: string[] = [];
      mockMutateBasicInfo.mockImplementation(async () => {
        callOrder.push("basicInfo");
        return {};
      });
      mockMutateDetail.mockImplementation(async () => {
        callOrder.push("detail");
        return {};
      });

      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(3000);
        await vi.advanceTimersByTimeAsync(3000);
        await promise;
      });

      expect(callOrder).toEqual(["basicInfo", "detail"]);
      expect(mockMutateBasicInfo).toHaveBeenCalledTimes(1);
      expect(mockMutateDetail).toHaveBeenCalledTimes(1);
    });

    it("shows progress states in correct order for admin", async () => {
      const loadingMessages: string[] = [];
      mockShowLoading.mockImplementation((msg: string) => {
        loadingMessages.push(msg);
      });

      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(3000);
        await vi.advanceTimersByTimeAsync(3000);
        await promise;
      });

      expect(loadingMessages).toContain(FORM_MESSAGES.SUBMITTING_FORM);
      expect(loadingMessages).toContain(FORM_MESSAGES.SUBMITTING_BASIC_INFO);
      expect(loadingMessages).toContain(FORM_MESSAGES.SUBMITTING_DETAILS);
      expect(loadingMessages).toContain(FORM_MESSAGES.SUCCESS);
    });

    it("passes correct payload to basicInfo mutation", async () => {
      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockMutateBasicInfo).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "john@example.com",
        department: "engineering",
        departmentName: "Engineering",
        role: "developer",
        employeeId: "EMP001",
      });
    });

    it("passes correct payload to detail mutation", async () => {
      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockMutateDetail).toHaveBeenCalledWith({
        photo: "data:image/png;base64,abc123",
        employmentType: "full-time",
        location: "jakarta",
        locationName: "Jakarta",
        notes: "Test notes",
        employeeId: "EMP001",
        email: "john@example.com",
      });
    });

    it("shows success toast and navigates to /employees when success", async () => {
      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockShowToast).toHaveBeenCalledWith({
        type: "success",
        message: FORM_MESSAGES.TOAST_SUCCESS,
        durationInMs: 5000,
      });
      expect(mockPush).toHaveBeenCalledWith("/employees");
    });

    it("hides loading modal on success", async () => {
      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockHideLoading).toHaveBeenCalled();
    });

    it("shows error toast when basicInfo mutation fails", async () => {
      mockMutateBasicInfo.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockShowToast).toHaveBeenCalledWith({
        type: "error",
        message: "Network error",
        durationInMs: 5000,
      });
      expect(mockHideLoading).toHaveBeenCalled();
    });

    it("shows error toast when detail mutation fails", async () => {
      mockMutateDetail.mockRejectedValue(new Error("Server error"));

      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockShowToast).toHaveBeenCalledWith({
        type: "error",
        message: "Server error",
        durationInMs: 5000,
      });
    });

    it("does not call detail mutation if basicInfo fails", async () => {
      mockMutateBasicInfo.mockRejectedValue(new Error("Failed"));

      const { result } = renderHook(() => useFormWizard(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        const promise = result.current.onSubmitForm(adminFormValues);
        await vi.advanceTimersByTimeAsync(6000);
        await promise;
      });

      expect(mockMutateBasicInfo).toHaveBeenCalledTimes(1);
      expect(mockMutateDetail).not.toHaveBeenCalled();
    });
  });
});
