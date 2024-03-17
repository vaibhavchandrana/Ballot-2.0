# Generated by Django 4.2.3 on 2023-11-15 06:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('voting', '0005_alter_election_created_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='election',
            name='candidates',
        ),
        migrations.AddField(
            model_name='candidate',
            name='election',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='candidates', to='voting.election'),
        ),
    ]