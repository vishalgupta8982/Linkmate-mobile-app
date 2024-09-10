export interface ExperiencePayload {
	company: string;
	startDate: string;
	endDate: string;
	position: string;
	description: string;
	experienceId?: string;
	locationType: LocationType;
	employmentType: EmploymentType;
}

enum EmploymentType {
	INTERNSHIP = 'Internship',
	PARTTIME = 'Part-time',
	FULLTIME = 'Full-time',
}
enum LocationType {
	HYBRID = 'Hybrid',
	REMOTE = 'Remote',
	ONSITE = 'Onsite',
}
