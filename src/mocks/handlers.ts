import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/mock/widgets/system-health", () => {
    return HttpResponse.json({ status: "green", score: 88, sources: 12, message: "All systems nominal" });
  }),
  http.get("/mock/widgets/data-quality", () => {
    return HttpResponse.json({ avg: 82.4 });
  }),
  http.get("/mock/widgets/compliance", () => {
    return HttpResponse.json({ score: 93, policies: 18 });
  }),
  http.get("/mock/widgets/cost", () => {
    return HttpResponse.json({ index: 140 });
  }),
  http.get("/mock/activity", ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    return HttpResponse.json({ page, items: [ { id: 1, text: "User logged in", ts: Date.now() } ] });
  }),
];
