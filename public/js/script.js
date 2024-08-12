document.addEventListener('DOMContentLoaded', function () {
  const todayOrdersContent = document.getElementById('todayOrdersContent');
  const last7DaysOrdersContent = document.getElementById(
    'last7DaysOrdersContent',
  );

  // Fetch and display today's orders
  fetch('/admin/orders/today')
    .then(response => response.json())
    .then(data => {
      todayOrdersContent.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Total Reward Points</th>
                                <th>Payment Option</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data
                              .map(
                                order => `
                                <tr>
                                    <td>${order._id}</td>
                                    <td>${new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()}</td>
                                    <td>${order.status}</td>
                                    <td>$${order.totalAmount}</td>
                                    <td>${order.totalRewardPoints}</td>
                                    <td>${order.paymentOption}</td>
                                    <td>${order.paymentStatus}</td>
                                </tr>
                            `,
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
            `;
    });

  // Fetch and display last 7 days' pending orders
  fetch('/admin/orders/last7days/pending')
    .then(response => response.json())
    .then(data => {
      last7DaysOrdersContent.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Total Reward Points</th>
                                <th>Payment Option</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data
                              .map(
                                order => `
                                <tr>
                                    <td>${order._id}</td>
                                    <td>${new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()}</td>
                                    <td>${order.status}</td>
                                    <td>$${order.totalAmount}</td>
                                    <td>${order.totalRewardPoints}</td>
                                    <td>${order.paymentOption}</td>
                                    <td>${order.paymentStatus}</td>
                                </tr>
                            `,
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
            `;
    });
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#itemTableBody tr');

    rows.forEach(row => {
      const itemName = row
        .querySelector('td:nth-child(1)')
        .textContent.toLowerCase();
      row.style.display = itemName.includes(searchTerm) ? '' : 'none';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const orderRows = document.querySelectorAll('#orderTableBody tr');
  let totalRewardPoints = 0;

  orderRows.forEach(row => {
    const rewardPointsCell = row.querySelector('td:nth-child(5)');
    const rewardPoints = parseFloat(rewardPointsCell.textContent) || 0;
    totalRewardPoints += rewardPoints;
  });

  document.getElementById('totalRewardPoints').textContent = totalRewardPoints;
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#orderTableBody tr');

    rows.forEach(row => {
      const orderId = row
        .querySelector('td:nth-child(1)')
        .textContent.toLowerCase();
      row.style.display = orderId.includes(searchTerm) ? '' : 'none';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
      const username = row.querySelector('td').textContent.toLowerCase();
      if (username.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});
