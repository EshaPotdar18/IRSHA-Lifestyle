export async function saveDraft(userId: string, assessment: any) {
  await fetch("/api/assessments/draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      assessment,
    }),
  })
}
