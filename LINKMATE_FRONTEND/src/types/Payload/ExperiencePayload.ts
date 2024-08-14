export interface ExperiencePayload {
	company: string;
	startDate: string;
	endDate: string;
	postion: string;
	description: string;
	locationType: LocationType;
	employmentType: EmploymentType;
}

enum EmploymentType {
	INTERNSHIP = 'Internship',
	PARTTIME = 'Part-Time',
	FULLTIME = 'Full-Time',
}
enum LocationType {
	HYBRID = 'Hybrid',
	REMOTE = 'Remote',
	ONSITE = 'Onsite',
}
