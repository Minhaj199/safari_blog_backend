export function isAgeBetween18And60(dob:string) {
    const birthDate = new Date(dob);
    const today = new Date();

    // Calculate age
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    const exactAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;

    return exactAge >= 18 && exactAge <= 60;
}