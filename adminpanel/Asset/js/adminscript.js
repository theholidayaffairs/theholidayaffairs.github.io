// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCHLhBPPXm5okf5jgseiRxgkz3ELexBEOc",
  authDomain: "theholidayaffairs-1f869.firebaseapp.com",
  databaseURL: "https://theholidayaffairs-1f869-default-rtdb.firebaseio.com/",
  projectId: "theholidayaffairs-1f869",
  storageBucket: "theholidayaffairs-1f869.appspot.com",
  messagingSenderId: "126766895295",
  appId: "1:126766895295:web:73247c13070275aaa3760a",
};

// ============================================================
// Initialize Firebase, auth & database
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ============================================================
// Login
function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    document.getElementById("errorMessage").classList.remove("d-none");
    document.getElementById("errorText1").classList.remove("d-none");
    document.getElementById("errorText2").classList.add("d-none");
    document.getElementById("errorText3").classList.add("d-none");
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("passwordSection").classList.add("d-none");
      document.getElementById("dataSection").classList.remove("d-none");
      document.getElementById("contactHeader").classList.remove("d-none");
      document.getElementById("logoutSection").classList.remove("d-none");
      fetchContactFormData();
    })
    .catch((error) => {
      document.getElementById("errorMessage").classList.remove("d-none");
      document.getElementById("errorText1").classList.add("d-none");
      document.getElementById("errorText2").classList.remove("d-none");
      document.getElementById("errorText3").classList.add("d-none");
    });
}

// ============================================================
// Logout
function logout() {
  auth.signOut(auth).then(() => {
    document.getElementById("passwordSection").classList.remove("d-none");
    document.getElementById("dataSection").classList.add("d-none");
    document.getElementById("contactHeader").classList.add("d-none");
    document.getElementById("logoutSection").classList.add("d-none");
    document.getElementById("errorMessage").classList.add("d-none");
    document.getElementById("errorText1").classList.add("d-none");
    document.getElementById("errorText2").classList.add("d-none");
    document.getElementById("errorText3").classList.add("d-none");
  });
}

// ============================================================
// Initialize Variable for Pagination
let allEntries = [];
let currentPage = 1;
const pageSize = 20;

// Fetch Contact Form Data
function fetchContactFormData(callback = null) {
  db.ref("/contactForm")
    .orderByChild("timestamp")
    .once("value")
    .then((snapshot) => {
      allEntries = [];
      snapshot.forEach((childSnapshot) => {
        let entry = childSnapshot.val();
        entry.id = childSnapshot.key; // Assign Firebase key as ID
        entry.timestamp = entry.timestamp || "N/A";
        allEntries.push(entry);
      });
      allEntries.reverse();
      if (callback) {
        callback(); // Call function after fetching data
      } else {
        updateTable(); // Default action if no callback
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

let showUnreadOnly = false; // Track filter state

function toggleUnreadFilter() {
  showUnreadOnly = !showUnreadOnly;
  document.getElementById("toggleUnreadBtn").textContent = showUnreadOnly
    ? "View All Messages"
    : "View Unread Messages";
  currentPage = 1; // Reset to first page when switching filters
  updateTable();
}

// ============================================================
// Update Contact Form Table
let filteredEntries = []; // Store filtered data

function applyDateFilter() {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  if (!fromDate || !toDate) {
    showModal(
      "Missing Dates!",
      "Please select both From and To dates before applying the filter.",
      "alert"
    );
    return;
  }

  const fromTimestamp = new Date(fromDate).setHours(0, 0, 0, 0);
  const toTimestamp = new Date(toDate).setHours(23, 59, 59, 999);

  filteredEntries = allEntries.filter((entry) => {
    let entryTimestamp = new Date(entry.timestamp).getTime();
    return entryTimestamp >= fromTimestamp && entryTimestamp <= toTimestamp;
  });

  currentPage = 1;
  updateTable();
}

function resetDateFilter() {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  filteredEntries = []; // Clear filter
  currentPage = 1; // Reset pagination
  updateTable(); // Show all entries again
}

// Modify updateTable() to use filteredEntries when filter is applied
let searchQuery = ""; // Stores search input

// Apply search filter dynamically
function applySearchFilter() {
  searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  updateTable(); // Refresh table with filtered data
}

// Reset filters (search & date)
function resetFilters() {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  document.getElementById("searchInput").value = "";
  searchQuery = "";
  filteredEntries = [];
  currentPage = 1;
  updateTable(); // Show all entries again
}

// Modify updateTable() to support search & date filters
function updateTable() {
  let tableBody = document.getElementById("dataTableBody");
  tableBody.innerHTML = "";

  let dataToShow = filteredEntries.length > 0 ? filteredEntries : allEntries;

  // Apply search filter if searchQuery is not empty
  if (searchQuery) {
    dataToShow = dataToShow.filter((entry) => {
      return (
        entry.name.toLowerCase().includes(searchQuery) ||
        entry.mobile.includes(searchQuery) ||
        (entry.email && entry.email.toLowerCase().includes(searchQuery))
      );
    });
  }

  // Apply unread filter if active
  if (showUnreadOnly) {
    dataToShow = dataToShow.filter((entry) => !entry.read);
  }

  // Sort by timestamp (latest first)
  dataToShow.sort((a, b) => b.timestamp - a.timestamp);

  // Apply pagination
  let totalPages = Math.ceil(dataToShow.length / pageSize) || 1;
  let pageData = dataToShow.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  pageData.forEach((entry) => {
    let formattedDate = formatTimestamp(entry.timestamp);
    let rowClass = entry.read ? "" : "fw-bold bg-warning";
    let statusText = entry.read ? "Read" : "Unread";
    let buttonText = entry.read ? "Mark as Unread" : "Mark as Read";

    let message = entry.message ? entry.message.trim() : "N/A";
    let truncatedMessage =
      message.length > 30 ? message.substring(0, 30) + "..." : message;

    let row = `<tr class='${rowClass}'>
            <td>${formattedDate}</td>
            <td>${entry.name}</td>
            <td>${entry.mobile}</td>
            <td>${entry.email || "N/A"}</td>
            <td class="text-truncate" style="max-width: 150px;">${truncatedMessage}</td>
            <td>${statusText}</td>
            <td>
                <div class="d-flex flex-wrap gap-2 justify-content-center">
                    <button class='btn btn-${
                      entry.read ? "warning" : "success"
                    } btn-sm' 
                        onclick='markAsRead("${entry.id}", ${entry.read})'
                        data-bs-toggle="tooltip" title="${buttonText}">
                        <i class="fa-solid ${
                          entry.read ? "fa-envelope-open" : "fa-envelope"
                        }"></i>
                    </button>
                    <button class='btn btn-info btn-sm' 
                        onclick='viewMessage("${entry.id}")' 
                        data-bs-toggle="tooltip" title="View Message">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class='btn btn-danger btn-sm' 
                        onclick='deleteEntry("${entry.id}")' 
                        data-bs-toggle="tooltip" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;

    tableBody.innerHTML += row;
  });

  updatePaginationUI(dataToShow.length);
}

// ============================================================
// Function to open modal with full message
let currentMessageId = null; // Store message ID for read/unread toggle

function viewMessage(id) {
  let entry = allEntries.find((e) => e.id === id);
  if (entry) {
    currentMessageId = id;

    document.getElementById("messageSender").innerText = entry.name || "N/A";
    document.getElementById("messageMobile").innerText = entry.mobile || "N/A";
    document.getElementById("messageEmail").innerText = entry.email || "N/A";
    document.getElementById("contactMessage").innerText =
      entry.message || "No message available.";

    // Show correct button based on read status
    document
      .getElementById("markReadBtn")
      .classList.toggle("d-none", entry.read);
    document
      .getElementById("markUnreadBtn")
      .classList.toggle("d-none", !entry.read);

    // Reinitialize Bootstrap tooltips
    setTimeout(() => {
      let tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      tooltipTriggerList.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
    }, 200); // Small delay ensures tooltips work after modal opens

    let modal = new bootstrap.Modal(
      document.getElementById("contactMessageModal")
    );
    modal.show();
  } else {
    console.error("Message not found for ID:", id);
  }
}

// ============================================================
// Show Modal
function showModal(title, message, type, callback = null) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;

  let modalIcon = document.getElementById("modalIcon");
  let modalConfirm = document.getElementById("modalConfirm");
  let modalCancel = document.getElementById("modalCancel");

  if (type === "confirm") {
    modalIcon.className =
      "fa-solid fa-exclamation-triangle text-warning fa-3x mb-3"; // ⚠️ Warning Icon
    modalConfirm.classList.remove("d-none");
    modalConfirm.onclick = () => {
      if (callback) callback();
      bootstrap.Modal.getInstance(
        document.getElementById("customModal")
      ).hide();
    };
  } else if (title === "Deleted") {
    modalIcon.className = "fa-solid fa-check-circle text-success fa-3x mb-3"; // ✅ Success Icon
    modalConfirm.classList.add("d-none");
    modalCancel.innerHTML = '<i class="fa-solid fa-times"></i> Close';
  } else {
    modalIcon.className = "fa-solid fa-circle-info text-primary fa-3x mb-3"; // ℹ️ Info Icon
    modalConfirm.classList.add("d-none");
    modalCancel.innerHTML = '<i class="fa-solid fa-times"></i> Close';
  }

  let modal = new bootstrap.Modal(document.getElementById("customModal"));
  modal.show();
}

// ============================================================
// Delete Contact Entry
function deleteEntry(entryId) {
  showModal(
    "Confirm Deletion",
    "Are you sure you want to delete this entry? This action cannot be undone.",
    "confirm",
    () => {
      let entryRef = db.ref(`/contactForm/${entryId}`);
      entryRef
        .remove()
        .then(() => {
          // ✅ Show success message after deletion
          showModal("Deleted", "Entry deleted successfully.", "alert");

          fetchContactFormData(() => {
            if (filteredEntries.length > 0) {
              applyDateFilter(); // Reapply filter if active
            } else {
              updateTable(); // Otherwise, just update table
            }
          });
        })
        .catch((error) => console.error("Error deleting entry:", error));
    }
  );
}

// ============================================================
// Mark the Contact Data As Read
function markAsRead(entryId, currentStatus) {
  let entryRef = db.ref(`/contactForm/${entryId}`);
  let newStatus = !currentStatus; // Toggle status

  entryRef
    .update({ read: newStatus })
    .then(() => {
      // Refresh data properly
      fetchContactFormData(() => {
        if (filteredEntries.length > 0) {
          applyDateFilter(); // Reapply filter if active
        } else {
          updateTable(); // Otherwise, just update table
        }
      });
    })
    .catch((error) => console.error("Error updating status:", error));
}

// ============================================================
// Excell Export
function exportToExcel(type) {
  let filteredEntries =
    type === "unread" ? allEntries.filter((entry) => !entry.read) : allEntries;

  if (filteredEntries.length === 0) {
    alert("No data available to export.");
    return;
  }

  let tableHeaders = [
    "Timestamp",
    "Name",
    "Mobile",
    "Email",
    "Message",
    "Status",
  ];
  let tableData = filteredEntries.map((entry) => [
    new Date(entry.timestamp).toLocaleString(),
    entry.name,
    entry.mobile,
    entry.email || "N/A",
    entry.message || "N/A",
    entry.read ? "Read" : "Unread",
  ]);

  let worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  let workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

  XLSX.writeFile(
    workbook,
    `Contact_Form_${type === "unread" ? "Unread" : "All"}_Submissions.xlsx`
  );

  // Close the modal after exporting
  let modalElement = document.getElementById("exportModal");
  let modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}

function exportToExcelByDate() {
  const fromDateInput = document.getElementById("exportFromDate").value;
  const toDateInput = document.getElementById("exportToDate").value;

  if (!fromDateInput || !toDateInput) {
    showModal(
      "Missing Dates!",
      "Please select both From and To dates before exporting.",
      "alert"
    );
    return;
  }

  let fromTimestamp = new Date(fromDateInput).setHours(0, 0, 0, 0);
  let toTimestamp = new Date(toDateInput).setHours(23, 59, 59, 999);

  // **Validation: To Date should not be earlier than From Date**
  if (toTimestamp < fromTimestamp) {
    showModal(
      "Invalid Date Range!",
      "The 'To Date' cannot be earlier than the 'From Date'. Please select a valid date range.",
      "alert"
    );
    return;
  }

  // **Filter Entries by Date Range**
  let filteredEntries = allEntries.filter((entry) => {
    let entryTimestamp = new Date(entry.timestamp).getTime();
    return entryTimestamp >= fromTimestamp && entryTimestamp <= toTimestamp;
  });

  if (filteredEntries.length === 0) {
    showModal(
      "No Data Found!",
      "No records found for the selected date range.",
      "alert"
    );
    return;
  }

  // **Prepare Data for Export**
  let tableHeaders = [
    "Timestamp",
    "Name",
    "Mobile",
    "Email",
    "Message",
    "Status",
  ];
  let tableData = filteredEntries.map((entry) => [
    new Date(entry.timestamp).toLocaleString(),
    entry.name,
    entry.mobile,
    entry.email || "N/A",
    entry.message || "N/A",
    entry.read ? "Read" : "Unread",
  ]);

  let worksheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData]);
  let workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered_Data");

  XLSX.writeFile(workbook, `Export_${fromDateInput}_to_${toDateInput}.xlsx`);

  // **Close Modal After Export**
  let modalElement = document.getElementById("exportByDateModal");
  let modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}

// ============================================================
// Update Pagination
function updatePaginationUI(totalEntries) {
  let totalPages = Math.ceil(totalEntries / pageSize) || 1;
  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;
  document.getElementById(
    "pageInfo"
  ).innerText = `Page ${currentPage} of ${totalPages}`;
}

// Ensure pagination updates correctly when navigating pages
document.getElementById("nextPage").addEventListener("click", () => {
  let dataToShow = filteredEntries.length > 0 ? filteredEntries : allEntries;
  if (searchQuery) {
    dataToShow = dataToShow.filter((entry) => {
      return (
        entry.name.toLowerCase().includes(searchQuery) ||
        entry.mobile.includes(searchQuery) ||
        (entry.email && entry.email.toLowerCase().includes(searchQuery))
      );
    });
  }
  if (showUnreadOnly) {
    dataToShow = dataToShow.filter((entry) => !entry.read);
  }

  if (currentPage < Math.ceil(dataToShow.length / pageSize)) {
    currentPage++;
    updateTable();
  }
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
});

// ============================================================
// Timestamp Format
function formatTimestamp(isoString) {
  let date = new Date(isoString);
  let options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", "");
}

// ============================================================
// Setting Modal Scripts for email enable/disable
// Fetch email sending status from Firebase
function fetchEmailSendingStatus() {
  db.ref("config/emailSendingEnabled")
    .once("value")
    .then((snapshot) => {
      emailSendingEnabled = snapshot.val() === true;
      console.log("Email Sending Enabled:", emailSendingEnabled);
      updateEmailStatusUI();
    })
    .catch((error) => console.error("Error fetching email status:", error));
}

// Toggle email sending flag in Firebase
function toggleEmailSending() {
  emailSendingEnabled = !emailSendingEnabled;
  db.ref("config/emailSendingEnabled")
    .set(emailSendingEnabled)
    .then(() => {
      console.log("Email Sending Updated:", emailSendingEnabled);
      updateEmailStatusUI();
    })
    .catch((error) => console.error("Error updating email status:", error));
}

// Update UI based on email status
function updateEmailStatusUI() {
  const sendMailToggle = document.getElementById("sendMailToggle");
  if (sendMailToggle) {
    sendMailToggle.checked = emailSendingEnabled; // Sync toggle switch with Firebase
  }
}

// Ensure the script runs after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
  const sendMailToggle = document.getElementById("sendMailToggle");
  if (!sendMailToggle) {
    console.error("Error: sendMailToggle element not found in the DOM.");
    return;
  }

  // Attach event listener to toggle switch
  sendMailToggle.addEventListener("change", toggleEmailSending);

  // Fetch initial email setting status when page loads
  fetchEmailSendingStatus();
});

// ============================================================
// Refresh Admin Panel
function refreshAdminPanel() {
  fetchContactFormData(); // Refresh contact form data
  fetchEmailSendingStatus(); // Refresh email setting status
}

// ============================================================
// Toggle read/unread status
function toggleReadStatus() {
  if (!currentMessageId) return; // No message selected

  let entry = allEntries.find((e) => e.id === currentMessageId);
  if (!entry) return;

  let newStatus = !entry.read; // Toggle read/unread status

  let entryRef = db.ref(`/contactForm/${currentMessageId}`);
  entryRef
    .update({ read: newStatus })
    .then(() => {
      // Update button visibility
      document
        .getElementById("markReadBtn")
        .classList.toggle("d-none", newStatus);
      document
        .getElementById("markUnreadBtn")
        .classList.toggle("d-none", !newStatus);

      // Refresh table after status change
      fetchContactFormData(() => {
        if (filteredEntries.length > 0) {
          applyDateFilter();
        } else {
          updateTable();
        }
      });
    })
    .catch((error) => console.error("Error updating message status:", error));
}

// ============================================================
// Date Placeholder
function toggleDatePlaceholder(input) {
  if (!input.value) {
    input.type = "text"; // Switch back to text type
    input.placeholder = input.id === "fromDate" ? "From Date" : "To Date";
  }
}

// Initialize placeholders on page load
document.addEventListener("DOMContentLoaded", function () {
  toggleDatePlaceholder(document.getElementById("fromDate"));
  toggleDatePlaceholder(document.getElementById("toDate"));
});

// Date Range Validation
function validateDateRange() {
  const fromDateInput = document.getElementById("fromDate");
  const toDateInput = document.getElementById("toDate");

  if (fromDateInput.value && toDateInput.value) {
    let fromTimestamp = new Date(fromDateInput.value).getTime();
    let toTimestamp = new Date(toDateInput.value).getTime();

    // If "To Date" is earlier than "From Date", show error
    if (toTimestamp < fromTimestamp) {
      showModal(
        "Invalid Date Range!",
        "The 'To Date' cannot be earlier than the 'From Date'. Please select a valid date range.",
        "alert"
      );
      toDateInput.value = ""; // Clear the incorrect date selection
    }
  }
}

// ============================================================
