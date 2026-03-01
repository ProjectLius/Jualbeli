// --- 1. MASUKKAN URL API ---
const URL_API =
  "https://script.google.com/macros/s/AKfycbzOFuoNDhGlgCUWVyka1lPg1uj0QDE81hq6QPGBjExsA-AcJ47WUlyEPzpBNIzLaaUC2Q/exec";

let semuaDataProduk = [];

const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");

mobileMenu.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

const areaBeranda = document.getElementById("area-beranda");
const areaProduk = document.getElementById("area-produk");
const judulKategori = document.getElementById("judul-kategori");

function pilihKategori(kategori) {
  navMenu.classList.remove("active");
  areaBeranda.style.display = "none";
  areaProduk.style.display = "block";
  judulKategori.innerText = "Kategori: " + kategori;

  const dataDisaring = semuaDataProduk.filter(
    (produk) => produk.kategori.toLowerCase() === kategori.toLowerCase(),
  );
  tampilkanProduk(dataDisaring);
}

function kembaliKeHome() {
  navMenu.classList.remove("active");
  areaProduk.style.display = "none";
  areaBeranda.style.display = "block";
}

// --- FUNGSI AMBIL DATA (INSTAN ANTI LEMOT) ---
async function ambilData() {
  try {
    // Tambahan ?t=... agar browser selalu narik data paling baru dari server
    const response = await fetch(URL_API + "?t=" + new Date().getTime());
    const data = await response.json();
    semuaDataProduk = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function tampilkanProduk(data) {
  const container = document.getElementById("penjualan");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; width:100%;">Belum ada produk di kategori ini.</p>';
    return;
  }

  data.forEach((produk) => {
    const hargaRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(produk.harga);

    const pesanWA = `Halo, saya tertarik dengan ${produk.nama} seharga ${hargaRupiah}. Apakah masih tersedia?`;
    const linkWA = `https://wa.me/${produk.nowa}?text=${encodeURIComponent(pesanWA)}`;

    const kartuHTML = `
            <div class="kartu-produk">
                <div class="gambar-container">
                    <img src="${produk.gambar}" alt="${produk.nama}" loading="lazy">
                </div>
                <div class="info-produk">
                    <h3>${produk.nama}</h3>
                    <p class="harga">${hargaRupiah}</p>
                    <p class="deskripsi" style="font-size:0.9rem; opacity:0.8; margin-bottom:15px;">${produk.deskripsi}</p>
                    <a href="${linkWA}" target="_blank" class="btn-wa">Beli via WhatsApp</a>
                </div>
            </div>
        `;
    container.innerHTML += kartuHTML;
  });
}

// Jalankan saat web dibuka
window.onload = ambilData;
