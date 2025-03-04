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
  const email = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

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
function fetchContactFormData() {
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
      updateTable();
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
function updateTable() {
  let tableBody = document.getElementById("dataTableBody");
  tableBody.innerHTML = "";

  let filteredEntries = showUnreadOnly
    ? allEntries.filter((entry) => !entry.read)
    : allEntries;

  // Sort by timestamp (latest first)
  filteredEntries.sort((a, b) => b.timestamp - a.timestamp);

  // Apply pagination
  let totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;
  let pageData = filteredEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  pageData.forEach((entry) => {
    let formattedDate = formatTimestamp(entry.timestamp);
    let rowClass = entry.read ? "" : "fw-bold bg-warning"; // Highlight unread
    let statusText = entry.read ? "Read" : "Unread";
    let buttonText = entry.read ? "Mark as Unread" : "Mark as Read";

    let row = `<tr class='${rowClass}'>
    <td>${formattedDate}</td>
    <td>${entry.name}</td>
    <td>${entry.mobile}</td>
    <td>${entry.email || "N/A"}</td>
    <td>${entry.message || "N/A"}</td>
    <td>${statusText}</td>
    <td>
        <div class="d-flex flex-wrap gap-2 justify-content-center">
            <button class='btn btn-${
              entry.read ? "warning" : "success"
            } btn-sm d-flex align-items-center' 
                onclick='markAsRead("${entry.id}", ${entry.read})'
                data-bs-toggle="tooltip" title="${buttonText}">
                <i class="fa-solid ${
                  entry.read ? "fa-envelope-open" : "fa-envelope"
                }"></i>
            </button>
            <button class='btn btn-danger btn-sm d-flex align-items-center' 
                onclick='deleteEntry("${entry.id}")' 
                data-bs-toggle="tooltip" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </td>
</tr>`;
    tableBody.innerHTML += row;
  });

  updatePaginationUI(filteredEntries.length);
}

// ============================================================
//
function showModal(title, message, type, callback) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;

  let modalIcon = document.getElementById("modalIcon");
  let modalConfirm = document.getElementById("modalConfirm");
  let modalCancel = document.getElementById("modalCancel");

  if (type === "confirm") {
    modalIcon.className =
      "fa-solid fa-exclamation-triangle text-warning fa-3x mb-3";
    modalConfirm.classList.remove("d-none");
    modalConfirm.onclick = () => {
      callback();
      bootstrap.Modal.getInstance(
        document.getElementById("customModal")
      ).hide();
    };
  } else {
    modalIcon.className = "fa-solid fa-check-circle text-success fa-3x mb-3";
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
          showModal("Deleted", "Entry deleted successfully.", "alert");
          fetchContactFormData();
        })
        .catch((error) => console.error("Error deleting entry:", error));
    }
  );
}

// ============================================================
// Mark the Contact Data As Read
function markAsRead(entryId, currentStatus) {
  let entryRef = db.ref(`/contactForm/${entryId}`);
  let newStatus = !currentStatus; // Toggle between true and false

  entryRef
    .update({ read: newStatus })
    .then(() => {
      fetchContactFormData(); // Refresh the table after updating
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

document.getElementById("nextPage").addEventListener("click", () => {
  let totalEntries = showUnreadOnly
    ? allEntries.filter((entry) => !entry.read).length
    : allEntries.length;
  if (currentPage < Math.ceil(totalEntries / pageSize)) {
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

let emailSendingEnabled = false; // Default state

// Ensure the script runs after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the toggle switch element
  const sendMailToggle = document.getElementById("sendMailToggle");

  if (!sendMailToggle) {
    console.error("Error: sendMailToggle element not found in the DOM.");
    return;
  }

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
    sendMailToggle.checked = emailSendingEnabled; // Sync toggle switch with Firebase
  }

  // Attach event listener to toggle switch
  sendMailToggle.addEventListener("change", toggleEmailSending);

  // Fetch initial status when page loads
  fetchEmailSendingStatus();
});

// ============================================================
