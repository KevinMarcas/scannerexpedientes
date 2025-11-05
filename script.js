        let activeColumn = 0;
        const inputModal = document.getElementById('input-modal');
        const scanInput = document.getElementById('scan-input');
        const modalAcceptBtn = document.getElementById('modal-accept-btn');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');


        function transformCode(rawCode) {

            let part1 = rawCode.substring(5, 10); 
            
            let part2 = rawCode.substring(1, 5); 
            
            let part3 = rawCode.substring(18, 20); 
            
            let part4 = rawCode.substring(10, 14); 

            const transformedExpedient = `${part1}-${part2}-${part3}-${part4}-JR-PE-01`;

            return transformedExpedient;
        }



        function openScanModal() {
            inputModal.style.display = 'flex';
            
            scanInput.value = ''; 
            setTimeout(() => scanInput.focus(), 50); 
        }

        function closeScanModal() {
            inputModal.style.display = 'none';
            scanInput.value = '';
        }

        function processExpedient() {
            const rawCode = scanInput.value.trim();
            
 
            if (rawCode === "") {

                scanInput.value = '';
                return; 
            }


            if (rawCode.length < 20) {
                    alert("El código ingresado es demasiado corto. (Mínimo 20 caracteres)");
                    scanInput.value = ''; 
                    scanInput.focus();
                    return;
                }
            
            if (rawCode.length > 23) {
                    alert("El código no corresponde a un EXPEDIENTE. (Máximo 23 caracteres)");
                    scanInput.value = ''; 
                    scanInput.focus();
                    return;
                }

            const finalExpedient = transformCode(rawCode);

            
            insertExpedient(finalExpedient, activeColumn);

            scanInput.value = '';
            scanInput.focus();
        }

        function insertExpedient(expedient, column) {
            const listElement = document.getElementById(`list-column-${column}`);
            const newListItem = document.createElement('li');
            newListItem.textContent = expedient;
            listElement.appendChild(newListItem);
        }

 
        document.querySelectorAll('.scan-btn').forEach(button => {
            button.addEventListener('click', function() {
                activeColumn = parseInt(this.getAttribute('data-column'));
                openScanModal();
            });
        });

 
        modalAcceptBtn.addEventListener('click', processExpedient);
        modalCancelBtn.addEventListener('click', closeScanModal);

        scanInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                processExpedient();
            }
        });


        document.getElementById('clear-list-btn').addEventListener('click', function() {
            if (confirm("¿Estás seguro de que quieres limpiar todos los expedientes de la lista?")) {
                document.getElementById('list-column-1').innerHTML = '';
                document.getElementById('list-column-2').innerHTML = '';
                document.getElementById('list-column-3').innerHTML = '';
            }
        });



/**
 * 
 * @returns {Array<Array<string>>} 
 */
function getAllData() {
    const data = [
        ["COLUMNA 1 - EXPEDIENTES", "COLUMNA 2 - EXPEDIENTES", "COLUMNA 3 - EXPEDIENTES"] 
    ];
    
    const list1 = Array.from(document.getElementById('list-column-1').children).map(li => li.textContent);
    const list2 = Array.from(document.getElementById('list-column-2').children).map(li => li.textContent);
    const list3 = Array.from(document.getElementById('list-column-3').children).map(li => li.textContent);
    

    const maxLength = Math.max(list1.length, list2.length, list3.length);

    for (let i = 0; i < maxLength; i++) {
        data.push([
            list1[i] || "",
            list2[i] || "",
            list3[i] || ""
        ]);
    }
    return data;
}


document.getElementById('export-excel-btn').addEventListener('click', function() {
    const data = getAllData();


    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expedientes Escaneados");

    XLSX.writeFile(wb, "Expedientes_Poder_Judicial.xlsx");
});


document.getElementById('print-pdf-btn').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    

    const input = document.querySelector('.scan-area');
    

    const canvas = await html2canvas(input, {
        scale: 2, 
        logging: true,
        useCORS: true 
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 200; 
    const pageHeight = doc.internal.pageSize.height;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;


    doc.setFontSize(18);
    doc.text("Reporte de Expedientes Escaneados", 10, 10);
    

    doc.addImage(imgData, 'PNG', 5, 20, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 5, position + 20, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }


    doc.save('Reporte_Expedientes.pdf');
});

// --- Función para Limpiar la Lista (Ya implementada en el paso anterior) ---
// document.getElementById('clear-list-btn').addEventListener('click', function() { ... });