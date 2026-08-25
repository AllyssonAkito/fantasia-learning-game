import { ActivityAsset } from '../activity/ActivityAsset';

const availableCourses = [
  {
    id: 'course.logic',
    label: 'Lógica',
    assetIds: [
      'asset.symbol.star',
      'asset.symbol.heart',
      'asset.symbol.circle',
    ],
  },
  {
    id: 'course.attention',
    label: 'Atenção',
    assetIds: [
      'asset.symbol.flower',
      'asset.symbol.carrot',
      'asset.symbol.ball',
    ],
  },
] as const;

export interface CourseSelectionProps {
  onSelect: (courseId: string) => void;
}

export function CourseSelection({ onSelect }: CourseSelectionProps) {
  return (
    <section
      aria-labelledby="course-selection-title"
      className="course-selection"
    >
      <p className="course-selection__eyebrow">Escolha uma aventura</p>
      <h1 id="course-selection-title">Nível 1</h1>
      <div aria-label="Áreas do Nível 1" className="course-selection__options">
        {availableCourses.map((course) => (
          <button
            aria-label={`Abrir ${course.label}`}
            className="course-selection__option"
            data-course-id={course.id}
            key={course.id}
            onClick={() => onSelect(course.id)}
            type="button"
          >
            <span aria-hidden="true" className="course-selection__cover">
              {course.assetIds.map((assetId, index) => (
                <span
                  className={
                    course.id === 'course.attention' && index === 1
                      ? 'course-selection__asset course-selection__asset--focus'
                      : 'course-selection__asset'
                  }
                  key={assetId}
                >
                  <ActivityAsset assetId={assetId} decorative />
                </span>
              ))}
            </span>
            <strong>{course.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
