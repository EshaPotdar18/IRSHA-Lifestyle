export function flattenAssessment(a: any) {
  return {
    assessmentId: a.id,
    userId: a.userId,
    employeeId: a.employeeId,
    employeeName: a.employeeName,
    submittedAt: a.submittedAt,

    // BASIC INFO
    basicInfo_age: a.basicInfo?.age,
    basicInfo_gender: a.basicInfo?.gender,
    basicInfo_height: a.basicInfo?.height,
    basicInfo_weight: a.basicInfo?.weight,

    // CLINICAL
    clinicalAssessment_bmi: a.clinicalAssessment?.bmi,
    clinicalAssessment_bloodGlucose: a.clinicalAssessment?.bloodGlucose,
    clinicalAssessment_systolicBP: a.clinicalAssessment?.systolicBP,
    clinicalAssessment_diastolicBP: a.clinicalAssessment?.diastolicBP,

    // BIOCHEMICAL
    biochemical_values_hba1c: a.biochemical?.values?.hba1c,
    biochemical_values_totalCholesterol: a.biochemical?.values?.totalCholesterol,
    biochemical_values_hdl: a.biochemical?.values?.hdl,
    biochemical_values_ldl: a.biochemical?.values?.ldl,
    biochemical_values_triglycerides: a.biochemical?.values?.triglycerides,

    biochemical_prakriti_conclusion: a.biochemical?.prakriti?.conclusion,

    // IDRS
    idrs_score: a.idrs?.totalScore,
  }
}
