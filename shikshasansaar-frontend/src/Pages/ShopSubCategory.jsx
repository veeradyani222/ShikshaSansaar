import React, { useContext, useState, useEffect } from 'react';
import './CSS/ShopSubCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import { Player } from '@lottiefiles/react-lottie-player';
import Loading from '../Components/assets/pro-library-loading.json';
import Filter from '../Components/Filter/Filter'; // Import Filter component

const ShopSubCategory = (props) => {
  // Mapping short categories to their full names
    const categoryMap = {
      dt: "Direct Tax (DT)",
      idt: "Indirect Tax (IDT)",
      advacc:"Accounts",
      acc:"Accounts",
      dtidt:"Direct Tax (DT)",
      dtidt:"Indirect Tax (IDT)"

    };
  
    // Normalize category to match the full name from the mapping
    const getNormalizedCategory = (category) => {
      return categoryMap[category.toLowerCase()] || category;
    };
  
    const { all_products, getImageSrcByCode } = useContext(ShopContext);
    
      // States for filtering, sorting, and pagination
      const [filteredCourses, setFilteredCourses] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [sortOption, setSortOption] = useState("");
      const [loading, setLoading] = useState(true);
      const [showFilter, setShowFilter] = useState(false); // State to toggle filter view
       const [normalizedCategory, setNormalizedCategory] = useState(getNormalizedCategory(props.category));
       const [normalizedPropSubCategory, setNormalizedPropSubCategory] = useState(getNormalizedCategory(props.sub_category));
       
      const coursesPerPage = 9;
  
      const [selectedCourse, setselectedCourse] = useState(getNormalizedCategory(props.category));
    const [selectedFaculties, setSelectedFaculties] = useState([]);
    const [selectedSubCategory, setselectedSubCategory] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedBatchType, setSelectedBatchType] = useState('');
    const [selectedLectureDuration, setSelectedLectureDuration] = useState('');
    
      // Set initial courses and disable loading once all_products is fetched
      useEffect(() => {
        if (all_products.length > 0) {
          setFilteredCourses(all_products);
          setLoading(false);
        }
      }, [all_products]);
  
      useEffect(() => {
        applyFilters({
          selectedCourse:normalizedCategory,
          selectedSubCategory:normalizedPropSubCategory,
          selectedFaculties,
          selectedSubjects,
          selectedBatchType,
          selectedLectureDuration,
        });
      }, [normalizedPropSubCategory, normalizedCategory,selectedSubCategory,selectedCourse, selectedFaculties, selectedSubjects, selectedBatchType, selectedLectureDuration, all_products]);
  
      const handleFilterChange = (filters) => {
        setNormalizedCategory(filters.selectedCourse || normalizedCategory);
        setNormalizedPropSubCategory(filters.selectedSubCategory || normalizedPropSubCategory)
        setselectedCourse(filters.selectedCourse );
        setSelectedFaculties(filters.selectedFaculties || []);
        setSelectedSubjects(filters.selectedSubjects || []);
        setSelectedBatchType(filters.selectedBatchType || '');
        setSelectedLectureDuration(filters.selectedLectureDuration || '');
      };
    
      // Apply filters based on user selection
      const applyFilters = (filters) => {
        let filtered = [...all_products];
      
        // Filter by selected course
        if (filters.selectedCourse) {
          const normalizedCategory = filters.selectedCourse.replace(/\s+/g, "").toLowerCase();
          filtered = filtered.filter(
            (course) =>
              course.category.replace(/\s+/g, "").toLowerCase() === normalizedCategory
          );
        }
      
        // Filter by selected faculties
        if (filters.selectedFaculties.length > 0) {
          filtered = filtered.filter((course) =>
            filters.selectedFaculties.some((faculty) =>
              course.lecturer
                .split("/")
                .map((item) => item.trim())
                .some(
                  (lec) =>
                    lec.replace(/\s+/g, "").toLowerCase() ===
                    faculty.replace(/\s+/g, "").toLowerCase()
                )
            )
          );
        }
      
      // Filter by selected subjects
if (filters.selectedSubjects.length > 0) {
  filtered = filtered.filter((course) =>
    filters.selectedSubjects.some((subject) =>
      course.subject
        .split("/") // Split course subjects by '/'
        .map((item) => item.trim().replace(/\s+/g, "").toLowerCase()) // Trim and normalize
        .some(
          (subj) =>
            subj === subject.trim().replace(/\s+/g, "").toLowerCase() // Compare normalized
        )
    )
  );
}

if (filters.selectedBatchType) {
  const normalizedBatchType = filters.selectedBatchType
    .replace(/\s+/g, "")
    .toLowerCase();

  filtered = filtered.filter((course) => {
    // Normalize and split the batch type string into separate keywords
    const batchTypeKeywords = course.batch_type
      .split(" ")
      .map((item) => item.trim().toLowerCase());

    // Check if any of the batch type keywords matches the selected filter
    return batchTypeKeywords.some(
      (keyword) => keyword === normalizedBatchType
    );
  });
}

      
        // Filter by selected lecture duration
        if (filters.selectedLectureDuration) {
          const [minDuration, maxDuration] = filters.selectedLectureDuration.split("-").map(Number);
          filtered = filtered.filter((course) => {
            const duration = parseInt(course.lecture_duration, 10);
            return duration >= minDuration && duration <= maxDuration;
          });
        }
      
        // Handle selectedSubCategory correctly, ensuring it's treated as an array
        const selectedSubCategoryArray = Array.isArray(filters.selectedSubCategory)
          ? filters.selectedSubCategory
          : [filters.selectedSubCategory].filter(Boolean);
      
        if (selectedSubCategoryArray.length > 0) {
          filtered = filtered.filter((course) =>
            selectedSubCategoryArray.some((subCat) =>
              course.sub_category
                .split("/")
                .map((item) => item.trim())
                .some(
                  (sub) =>
                    sub.replace(/\s+/g, "").toLowerCase() === subCat.replace(/\s+/g, "").toLowerCase()
                )
            )
          );
        }
      
        setFilteredCourses(filtered);
        setCurrentPage(1)
      };
      
      // Sort courses based on selected option
      const sortCourses = (sortOption) => {
        setSortOption(sortOption);
        let sorted = [...filteredCourses];
    
        switch (sortOption) {
          case "priceLowToHigh":
            sorted.sort((a, b) => a.new_price - b.new_price);
            break;
          case "priceHighToLow":
            sorted.sort((a, b) => b.new_price - a.new_price);
            break;
          case "alphabetical":
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "durationLowToHigh":
            sorted.sort((a, b) => parseInt(a.lecture_duration, 10) - parseInt(b.lecture_duration, 10));
            break;
          case "durationHighToLow":
            sorted.sort((a, b) => parseInt(b.lecture_duration, 10) - parseInt(a.lecture_duration, 10));
            break;
          default:
            break;
        }
    
        setFilteredCourses(sorted);
      };
    
      // Pagination logic
      const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
      const indexOfLastCourse = currentPage * coursesPerPage;
      const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
      const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
      const handleNext = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const handlePrevious = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const toggleFilter = () => {
        setShowFilter((prev) => !prev);
      };
      const isSmallScreen = window.matchMedia("(max-width: 480px)").matches;
    
  
      if (loading) {
        return (
          <div className="loading-main-whole-page">
            <div className="loading">
              <Player
                autoplay
                loop
                src={Loading}
                style={{
                  height: '100px',
                  width: '100px',
                  margin: '0 auto',
                }}
              />
            </div>
          </div>
        );
      }
    
    
      return (
        <div className="courses-container">
          
        {loading ? (
          <div className="loading-main-whole-page">
            <div className="loading">
              <Player
                autoplay
                loop
                src={Loading}
                style={{
                  height: "100px",
                  width: "100px",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        ) : ( 
          <>
            <div
              className={`filter-box ${isSmallScreen && showFilter ? "show-filter" : ""}`}
              style={{
                transform: isSmallScreen && showFilter ? "translateX(0)" : isSmallScreen ? "translateX(-100%)" : "none",
              }}
            >
          <Filter
            onApplyFilters={handleFilterChange} // Update filter states dynamically
            onSortChange={sortCourses}
            defaultFilters={{
              selectedCourse:normalizedCategory,
              selectedFaculties,
              selectedSubCategory:normalizedPropSubCategory,
              selectedSubjects,
              selectedBatchType,
              selectedLectureDuration,
            }}
          />
    
            </div>
    
            {/* Main content */}
            <div className="main-courses-content">
              <h1>{normalizedCategory} - {normalizedPropSubCategory}</h1>
              <div className="courses-content">
                {currentCourses.map((product) => (
                  <Item
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={getImageSrcByCode(product.image_code)}
                    category={product.category}
                    sub_category={product.sub_category}
                    tag={product.tag}
                    lecturer={product.lecturer}
                    new_price={product.new_price}
                    old_price={product.old_price}
                    reviews={product.reviews}
                    main_review={product.main_review}
                    lecture_duration={product.lecture_duration}
                  />
                ))}
              </div>
    
              {/* Pagination */}
              <div className="pagination">
    <button onClick={handlePrevious} disabled={currentPage === 1}>
      Previous
    </button>
    <span className="page-info-courses">
      Page {currentPage} of {totalPages}
    </span>
    <button onClick={handleNext} disabled={currentPage === totalPages}>
      Next
    </button>
    </div>
    
            </div>
    
            {isSmallScreen && (
              <div className="responsive-buttons">
                <button onClick={toggleFilter} className="sort-and-filter-buttons">
                  {showFilter ? "Done" : "Sort and Filter"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      );
    };
    
    export default ShopSubCategory;
