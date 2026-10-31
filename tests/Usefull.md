# Usefull Commands
## Look at current flash memory
### Get flash memory from device
$ st-flash read flash_backup.bin 0x08000000 0x8000
### Look at disassembly
$ arm-none-eabi-objdump -D -b binary -m arm -M force-thumb --adjust-vma=0x08000000 flash_backup.bin | less

## Debugging with gdb

### Preparing ELF
Compile ELF with Compiler-Flags as needed. (e.g. -O0 for no optimizations and -g3 for keeping Makro-Definitions)

### Start st-util server
$ st-util
### Connect GDB
$ gdb \[programm-name\].elf

(gdb) target extended-remote :4242

(gdb) monitor reset halt

(gdb) load

(gdb) break main

(gdb) continue

### Look at registers
(gdb) info registers //For CPU

(gdb) x/1xw \[address-to-other-registers\]