import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Filter.css';

const Filter = ({ onApplyFilters, defaultFilters = {}, onSortChange }) => {
  const { all_faculties, all_products } = useContext(ShopContext);

  // Default values for filters
  const initialFilterParams = {
    selectedCourse: defaultFilters.selectedCourse || '',
    selectedSubCourse: defaultFilters.selectedSubCourse || '',
    selectedFaculties: defaultFilters.selectedFaculties || [],
    selectedSubjects: defaultFilters.selectedSubjects || [],
    selectedBatchType: defaultFilters.selectedBatchType || '',
    selectedLectureDuration: defaultFilters.selectedLectureDuration || '',
  };

  const [filterParams, setFilterParams] = useState(initialFilterParams);
  const [searchFaculty, setSearchFaculty] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    course: false,
    subject: false,
    faculty: false,
    batchType: false,
    lectureDuration: false,
  });
  const [sortOption, setSortOption] = useState('');

  const courseOptions = ['CA Final', 'CA Inter', 'CMA Courses', 'CS Courses'];
  const batchTypeOptions = ['Combo', 'Fast Track', 'Exam Oriented', 'Regular'];
  const lectureDurationOptions = [
    '1-50',
    '51-100',
    '101-200',
    '201-300',
    '301-400',
    '401-500',
    '501-600',
    '601-700',
    '701-800',
    '801-900',
    '901-1000',
  ];

  const subjectOptions = {
    'CA Final': [
      'Financial Reporting',
      'Direct Tax Laws and International Taxation',
      'Indirect Tax Laws',
      'Advanced Financial Management',
      'Advanced Auditing Assurance and Professional Ethics',
    ],
    'CA Inter': [
      'Accounting',
      'Corporate and Other Laws',
      'Cost and Management Accounting',
      'Taxation',
      'Advanced Accounting',
      'Auditing and Assurance',
    ],
    'CMA Courses': [
      'Fundamentals of Financial Accounting',
      'Fundamentals of Laws and Ethics',
      'Fundamentals of Business Mathematics and Statistics',
    ],
    'CS Courses': [
      'Jurisprudence, Interpretation & General Laws',
      'Company Law',
      'Setting up of Business Entities and Closure',
    ],
  };

  const categoryData = {
    'CA Final': [
      'AFM',
      'Audit',
      'DT',
      'FR',
      'IDT',
      'LAW',
      'SCMPE',
    ],
    'CA Inter': [
      'Accounts',
      'Audit',
      'DT',
      'LAW',
      'Taxation',
    ],
    'CMA Courses': [
      'CMA Final',
      'CMA Foundation',
      'CMA Inter',
      'DT',
    ],
    'CS Courses': [
      'CS Executive',
      'CS Professional',
      'CSEET',
    ],
  };
  



  // Get relevant faculties based on selected course or subjects
  const filteredFaculties = all_faculties.filter((faculty) => {
    return all_products.some((product) => {
      // Check if the product's course matches the selected course
      const matchesCourse =
        filterParams.selectedCourse === '' || product.category === filterParams.selectedCourse;
  
      // Check if the product's subjects match the selected subjects
      const matchesSubjects =
        filterParams.selectedSubjects.length === 0 ||
        filterParams.selectedSubjects.some((subject) =>
          product.subject
            .split('\r\n') // Split the subjects by line break
            .map((s) => s.trim().toLowerCase()) // Normalize to lowercase and remove spaces
            .includes(subject.toLowerCase()) // Check if the subject is in the product
        );
  
      // Check if the faculty teaches the product (normalize faculty names)
      const matchesFaculty =
        product.lecturer
          .split('/') // Split the lecturers by slash
          .map((lecturer) => lecturer.trim().toLowerCase()) // Normalize to lowercase and remove spaces
          .includes(faculty.lecturer.toLowerCase()); // Check if the lecturer teaches this product
  
      return matchesCourse && matchesSubjects && matchesFaculty;
    });
  });


  // Handles single or multi-select updates
  const handleFilterChange = (key, value, isMultiSelect = false) => {
    const updatedFilters = { ...filterParams };

    if (isMultiSelect) {
      const currentSelection = updatedFilters[key];
      if (currentSelection.includes(value)) {
        updatedFilters[key] = currentSelection.filter((item) => item !== value); // Remove if already selected
      } else {
        updatedFilters[key] = [...currentSelection, value]; // Add to selection
      }
    } else {
      updatedFilters[key] = value;
    }

    setFilterParams(updatedFilters);
    onApplyFilters(updatedFilters);
  };

  

  const handleClearAll = () => {
    const clearedFilters = {
      selectedCourse: 'CA Final', // Reset to default
      selectedFaculties: [],
      selectedSubjects: [],
      selectedBatchType: '',
      selectedLectureDuration: '',
    };
    setFilterParams(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const toggleSection = (section) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort); // Update local state
    onSortChange(selectedSort); // Notify parent of the change
  };

  useEffect(() => {
    setFilterParams((prevFilters) => ({
      ...prevFilters,
      ...defaultFilters,
    }));
    onApplyFilters({ ...filterParams, ...defaultFilters });
  }, [defaultFilters, onApplyFilters]);


  const selectedSubCategories = categoryData[filterParams.selectedCourse] || [];
  

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3 className="filter-title">Filter Options</h3>
        <div className="filter-other-btns">
       <select className="sort-dropdown" value={sortOption} onChange={handleSortChange}>
      <option value="">Sort By</option>
      <option value="priceLowToHigh">Price: Low to High</option>
      <option value="priceHighToLow">Price: High to Low</option>
      <option value="alphabetical">Alphabetical</option>
      <option value="durationLowToHigh">Lectures Duration: Low to High</option>
      <option value="durationHighToLow">Lectures Duration: High to Low</option>

    </select>
        <button className="clear-all-button" onClick={handleClearAll}>
          Clear All
        </button>
        </div>
      </div>
      <div className="filter-grid">
        {/* Course Filter */}
        <div className="filter-item">
          <h4 onClick={() => toggleSection('course')}>
            Course{' '}
            {collapsedSections.course ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </h4>
          {!collapsedSections.course && (
            <div className="radio-buttons">
              {courseOptions.map((course) => (
                <label key={course} className="radio-label">
                  <input
                    type="radio"
                    name="course-filter"
                    value={course}
                    checked={filterParams.selectedCourse === course}
                    onChange={(e) =>
                      handleFilterChange('selectedCourse', e.target.value)
                    }
                  />
                  {course}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-item">
  <h4 onClick={() => toggleSection('subCategory')}>
    SubCategories{' '}
    {collapsedSections.subCategory ? (
      <FontAwesomeIcon icon={faChevronUp} />
    ) : (
      <FontAwesomeIcon icon={faChevronDown} />
    )}
  </h4>
  {!collapsedSections.subCategory && (
    <div className="radio-buttons">
      {selectedSubCategories.map((subCategory) => (
        <label key={subCategory} className="radio-label">
          <input
            type="radio"
            name="subcategory-filter"
            value={subCategory}
            checked={filterParams.selectedSubCategory === subCategory}
            onChange={(e) => handleFilterChange('selectedSubCategory', e.target.value)}
          />
          {subCategory}
        </label>
      ))}
    </div>
  )}
</div>

        {/* Subject Filter */}
        <div className="filter-item">
  <h4 onClick={() => toggleSection('subject')}>
    Subject{' '}
    {collapsedSections.subject ? (
      <FontAwesomeIcon icon={faChevronUp} />
    ) : (
      <FontAwesomeIcon icon={faChevronDown} />
    )}
  </h4>
  {!collapsedSections.subject && (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search subjects..."
        value={searchSubject}
        className="filter-inputs"
        onChange={(e) => setSearchSubject(e.target.value)}
      />
      <div className="checkbox-buttons">
        {subjectOptions[filterParams.selectedCourse]
          ?.flatMap((subjectGroup) =>
            subjectGroup
              .split("/") // Split subjects by '/'
              .map((subject) => subject.trim()) // Trim spaces
          )
          .filter((subject) =>
            subject.toLowerCase().includes(searchSubject.toLowerCase())
          )
          .map((subject) => (
            <label key={subject} className="checkbox-label">
              <input
                type="checkbox"
                name="subject-filter"
                value={subject}
                checked={filterParams.selectedSubjects.includes(subject)}
                onChange={(e) =>
                  handleFilterChange('selectedSubjects', e.target.value, true)
                }
              />
              {subject}
            </label>
          ))}
      </div>
    </div>
  )}
</div>

        {/* Faculty Filter */}
        <div className="filter-item">
  <h4 onClick={() => toggleSection('faculty')}>
    Faculty{' '}
    {collapsedSections.faculty ? (
      <FontAwesomeIcon icon={faChevronUp} />
    ) : (
      <FontAwesomeIcon icon={faChevronDown} />
    )}
  </h4>
  {!collapsedSections.faculty && (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search faculties..."
          className='filter-inputs'
        value={searchFaculty}
        onChange={(e) => setSearchFaculty(e.target.value)}
      />
      <div className="checkbox-buttons">
        {filteredFaculties
          .filter((faculty) =>
            faculty.lecturer.toLowerCase().includes(searchFaculty.toLowerCase())
          )
          .map((faculty) => (
            <label key={faculty._id} className="checkbox-label">
              <input
                type="checkbox"
                name="faculty-filter"
                value={faculty.lecturer}
                checked={filterParams.selectedFaculties.includes(faculty.lecturer)}
                onChange={(e) =>
                  handleFilterChange('selectedFaculties', e.target.value, true)
                }
              />
              {faculty.lecturer}
            </label>
          ))}
      </div>
    </div>
  )}
</div>


        {/* Batch Type Filter */}
        <div className="filter-item">
          <h4 onClick={() => toggleSection('batchType')}>
            Batch Type{' '}
            {collapsedSections.batchType ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </h4>
          {!collapsedSections.batchType && (
            <div className="radio-buttons">
              {batchTypeOptions.map((batchType) => (
                <label key={batchType} className="radio-label">
                  <input
                    type="radio"
                    name="batch-type-filter"
                    value={batchType}
                    checked={filterParams.selectedBatchType === batchType}
                    onChange={(e) =>
                      handleFilterChange('selectedBatchType', e.target.value)
                    }
                  />
                  {batchType}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Lecture Duration Filter */}
        <div className="filter-item">
          <h4 onClick={() => toggleSection('lectureDuration')}>
            Lecture Duration{' '}
            {collapsedSections.lectureDuration ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </h4>
          {!collapsedSections.lectureDuration && (
            <div className="radio-buttons">
              {lectureDurationOptions.map((duration) => (
                <label key={duration} className="radio-label">
                  <input
                    type="radio"
                    name="lecture-duration-filter"
                    value={duration}
                    checked={
                      filterParams.selectedLectureDuration === duration
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        'selectedLectureDuration',
                        e.target.value
                      )
                    }
                  />
                  {duration}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
