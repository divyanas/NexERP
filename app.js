let currentRole = 'student';
let html5QrcodeScanner = null;
let stream = null; // for media stream

const appDiv = document.getElementById('app');

const users = {
  student: { id: 'S123', name: 'Divyan', role: 'student' },
  faculty: { id: 'F456', name: 'Dr. Smith', role: 'faculty' }
};

const classes = [
  { id: 'CS101', name: 'Intro to Computer Science', time: '10:00 AM', attendance: 'pending' },
  { id: 'CS202', name: 'Data Structures', time: '1:00 PM', attendance: 'present' }
];

function render() {
  appDiv.innerHTML = '';
  appDiv.innerHTML += `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
  `;
  renderAuth();
}

function renderAuth() {
  const container = document.createElement('div');
  container.className = 'auth-container';
  
  container.innerHTML = `
    <div class="glass-panel auth-box">
      <div class="auth-logo">NexERP</div>
      <p style="margin-bottom: 2rem;">Secure Campus Management System</p>
      
      <div class="role-toggle">
        <div class="role-btn ${currentRole === 'student' ? 'active' : ''}" onclick="setRole('student')">Student</div>
        <div class="role-btn ${currentRole === 'faculty' ? 'active' : ''}" onclick="setRole('faculty')">Faculty</div>
      </div>
      
      <input type="text" id="userid" placeholder="${currentRole === 'student' ? 'Student ID' : 'Faculty ID'} (e.g. S123 or F456)" />
      <input type="password" id="password" placeholder="Password (any)" />
      
      <button class="btn" onclick="login()">Login to Dashboard</button>
      <div id="login-error" class="status-message absent" style="display:none; margin-top: 1rem;">Invalid Credentials</div>
    </div>
  `;
  
  appDiv.appendChild(container);
}

window.setRole = (role) => {
  currentRole = role;
  appDiv.innerHTML = '';
  appDiv.innerHTML += `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
  `;
  renderAuth();
}

window.login = () => {
  const id = document.getElementById('userid').value.trim();
  if (!id) return;
  if (currentRole === 'student' && users.student.id === id) {
    renderStudentDashboard();
  } else if (currentRole === 'faculty' && users.faculty.id === id) {
    renderFacultyDashboard();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function renderStudentDashboard() {
  appDiv.innerHTML = `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="dashboard">
      <div class="header">
        <div class="header-info">
          <div>Welcome, ${users.student.name}</div>
          <div>Student ID: ${users.student.id}</div>
        </div>
        <button class="btn btn-outline" style="width: auto;" onclick="logout()">Logout</button>
      </div>
      
      <div class="grid">
        <div class="glass-panel card">
          <div class="card-header">Your Classes Today</div>
          ${classes.map(c => `
            <div class="list-item">
              <div>
                <strong style="color: #fff; font-size: 1.1rem;">${c.id}</strong> - ${c.name}<br>
                <span style="font-size: 0.9rem; color: var(--text-muted);">${c.time}</span>
              </div>
              <span class="badge ${c.attendance}">${c.attendance}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="glass-panel card">
          <div class="card-header">Smart Attendance</div>
          <p>Scan your professor's QR code to mark your attendance using Face ID.</p>
          <button class="btn" onclick="renderQRScan()">Scan QR Code</button>
        </div>
      </div>
    </div>
  `;
}

function renderFacultyDashboard() {
  appDiv.innerHTML = `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="dashboard">
      <div class="header">
        <div class="header-info">
          <div>Welcome, ${users.faculty.name}</div>
          <div>Department of Computer Science</div>
        </div>
        <button class="btn btn-outline" style="width: auto;" onclick="logout()">Logout</button>
      </div>
      
      <div class="grid">
        <div class="glass-panel card">
          <div class="card-header">Manage Classes</div>
          ${classes.map(c => `
            <div class="list-item">
              <div>
                <strong style="color: #fff; font-size: 1.1rem;">${c.id}</strong> - ${c.name}<br>
                <span style="font-size: 0.9rem; color: var(--text-muted);">${c.time}</span>
              </div>
              <button class="btn" style="width: auto; padding: 8px 16px; font-size: 0.9rem; margin-bottom: 0;" onclick="renderQRCreation('${c.id}')">Start Session</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

window.renderQRCreation = (classId) => {
  appDiv.innerHTML = `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="dashboard">
      <button class="btn btn-outline" style="width: auto; margin-bottom: 2rem;" onclick="renderFacultyDashboard()">← Back to Dashboard</button>
      
      <div class="glass-panel" style="text-align: center; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #fff; margin-bottom: 1rem;">Active Session: ${classId}</h2>
        <p>Display this QR code for students to scan.</p>
        
        <div class="qr-container">
          <div id="qrcode"></div>
        </div>
        
        <p style="color: var(--accent); font-weight: 500;">Dynamic QR scanning is enabled.<br>Students will verify with Face Recognition.</p>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    new QRCode(document.getElementById("qrcode"), {
      text: "ATTENDANCE_" + classId + "_" + Date.now(),
      width: 220,
      height: 220,
      colorDark : "#0a0e17",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  }, 100);
}

window.renderQRScan = () => {
  appDiv.innerHTML = `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="dashboard">
      <button class="btn btn-outline" style="width: auto; margin-bottom: 2rem;" onclick="shutdownQR(); renderStudentDashboard()">← Cancel</button>
      
      <div class="glass-panel" style="text-align: center; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #fff; margin-bottom: 1rem;">Scan Attendance QR</h2>
        <p>Position the QR code within the frame.</p>
        
        <div id="reader"></div>
        <div class="status-message info" id="scan-info" style="display: block;">Requesting camera access...</div>
      </div>
    </div>
  `;
  
  html5QrcodeScanner = new Html5Qrcode("reader");
  
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  html5QrcodeScanner.start(
    { facingMode: "environment" },
    config,
    (decodedText) => {
      // Success
      document.getElementById('scan-info').className = 'status-message success';
      document.getElementById('scan-info').innerText = 'QR Code Scanned Successfully!';
      shutdownQR();
      setTimeout(() => renderFaceVerification(decodedText), 1000);
    },
    (errorMessage) => {
      // parse error, ignore
    }
  ).catch((err) => {
    document.getElementById('scan-info').className = 'status-message absent';
    document.getElementById('scan-info').innerText = 'Camera Error: Please allow camera permissions.';
  });
}

window.shutdownQR = () => {
  if (html5QrcodeScanner) {
    try {
      html5QrcodeScanner.stop().catch(e => console.log(e));
    } catch(e){}
    html5QrcodeScanner = null;
  }
}

window.renderFaceVerification = (qrData) => {
  appDiv.innerHTML = `
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="dashboard">
      <div class="glass-panel" style="text-align: center; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #fff; margin-bottom: 1rem;">Face Verification</h2>
        <p>Please look directly at the camera to verify your identity.</p>
        
        <div class="video-container" id="video-container">
          <video id="webcam" autoplay playsinline></video>
          <div class="face-frame"></div>
          <div class="scan-overlay" id="scan-overlay">
            <div class="scan-line"></div>
          </div>
        </div>
        
        <div class="status-message info" id="face-status" style="display: block;">Activating front camera...</div>
      </div>
    </div>
  `;
  
  const video = document.getElementById('webcam');
  const overlay = document.getElementById('scan-overlay');
  const status = document.getElementById('face-status');
  
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = mediaStream;
      document.getElementById('video-container').style.display = 'block';
      status.innerText = "Analyzing facial features...";
      
      // Simulate face analysis
      setTimeout(() => {
        overlay.style.display = 'block'; 
        status.innerText = "Scanning biometrics...";
        
        setTimeout(() => {
          overlay.style.display = 'none';
          status.innerText = "Face Verified Successfully!";
          status.className = "status-message success";
          
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
          }
          
          // Update attendance state
          classes[0].attendance = 'present';
          
          setTimeout(() => renderStudentDashboard(), 2500);
          
        }, 3000);
      }, 1500);
      
    })
    .catch(err => {
      status.innerText = "Camera access denied. Cannot verify face.";
      status.className = "status-message absent";
    });
}

window.logout = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  shutdownQR();
  currentRole = 'student';
  renderAuth();
}

// Start Application Flow
render();
