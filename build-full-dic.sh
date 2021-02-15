#!/bin/sh

DIC1=assets/fr1.txt
DIC2=assets/fr2.txt

FINAL_DIC=assets/fr.txt

echo "Dictionary ${DIC1}: "$(cat $DIC1 | wc -l)" words"
echo "Dictionary ${DIC2}: "$(cat $DIC2 | wc -l)" words"

cat $DIC1 $DIC2 | sort | uniq > ${FINAL_DIC}

echo "Final dictionary ${FINAL_DIC}: "$(cat $FINAL_DIC   | wc -l)" words"
